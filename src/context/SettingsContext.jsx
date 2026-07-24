import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase'
import { horario as horarioDefault } from '../data/products'

const SettingsContext = createContext(null)
const LS_KEY = 'bombonera_settings'
const ROW_ID = 1

const defaultSettings = {
  manual_closed: false,
  apertura: horarioDefault.apertura,
  cierre: horarioDefault.cierre,
  horario_label: horarioDefault.label,
}

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToLS(settings) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(settings)) } catch {}
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const stored = loadFromLS()
    return stored ? { ...defaultSettings, ...stored } : { ...defaultSettings }
  })

  const bcRef = useRef(null)
  const channelRef = useRef(null)

  const applySettings = (updater) => {
    setSettings(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveToLS(next)
      return next
    })
  }

  useEffect(() => {
    // Igual que Stock/PriceContext: Supabase es la fuente de verdad compartida,
    // localStorage solo evita el flash en el render inicial.
    const fetchSettings = () => {
      supabase.from('store_settings').select('*').eq('id', ROW_ID).maybeSingle().then(({ data, error }) => {
        if (error) { console.warn('[Settings] Supabase read:', error.message); return }
        if (data) {
          applySettings(prev => ({
            ...prev,
            manual_closed: data.manual_closed,
            apertura: data.apertura,
            cierre: data.cierre,
            horario_label: data.horario_label,
          }))
        }
      })
    }

    fetchSettings()

    const pollId = setInterval(fetchSettings, 20000)

    const onVisible = () => { if (document.visibilityState === 'visible') fetchSettings() }
    document.addEventListener('visibilitychange', onVisible)

    try {
      bcRef.current = new BroadcastChannel('bombonera_settings')
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === 'settings_update') {
          setSettings(prev => ({ ...prev, ...e.data.settings }))
        }
      }
    } catch {}

    try {
      channelRef.current = supabase
        .channel('settings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, payload => {
          if (payload.new) {
            applySettings(prev => ({
              ...prev,
              manual_closed: payload.new.manual_closed,
              apertura: payload.new.apertura,
              cierre: payload.new.cierre,
              horario_label: payload.new.horario_label,
            }))
          }
        })
        .subscribe()
    } catch {}

    return () => {
      clearInterval(pollId)
      document.removeEventListener('visibilitychange', onVisible)
      try { bcRef.current?.close() } catch {}
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  const updateSettings = async (partial) => {
    const prevSettings = settings
    const nextSettings = { ...settings, ...partial }

    applySettings(nextSettings)
    try { bcRef.current?.postMessage({ type: 'settings_update', settings: partial }) } catch {}

    const MAX_INTENTOS = 3
    let lastError = null
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
      try {
        const { error } = await supabase.from('store_settings').upsert(
          { id: ROW_ID, ...nextSettings },
          { onConflict: 'id' }
        )
        if (!error) return { error: null }
        lastError = error
      } catch (err) {
        lastError = err
      }
      if (intento < MAX_INTENTOS) await new Promise(r => setTimeout(r, 500 * intento))
    }

    console.warn('[Settings] Supabase sync falló tras reintentos:', lastError?.message || lastError)
    applySettings(prevSettings)
    try { bcRef.current?.postMessage({ type: 'settings_update', settings: prevSettings }) } catch {}
    return { error: lastError }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de SettingsProvider')
  return ctx
}
