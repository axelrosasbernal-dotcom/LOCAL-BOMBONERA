import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase'

const DailyPromoContext = createContext(null)
const LS_KEY = 'bombonera_daily_promos'

const emptyPromo = { titulo: '', descripcion: '', product_ids: [], precio_combo: null, activa: false }

const defaultMap = {}
for (let d = 0; d <= 6; d++) defaultMap[d] = { ...emptyPromo }

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToLS(map) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)) } catch {}
}

function rowToPromo(row) {
  return {
    titulo: row.titulo ?? '',
    descripcion: row.descripcion ?? '',
    product_ids: row.product_ids ?? [],
    precio_combo: row.precio_combo ?? null,
    activa: !!row.activa,
  }
}

export function DailyPromoProvider({ children }) {
  const [promoMap, setPromoMap] = useState(() => {
    const stored = loadFromLS()
    return stored ? { ...defaultMap, ...stored } : { ...defaultMap }
  })

  const bcRef = useRef(null)
  const channelRef = useRef(null)

  const applyMap = (updater) => {
    setPromoMap(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveToLS(next)
      return next
    })
  }

  useEffect(() => {
    // Igual que Stock/Price/SettingsContext: Supabase es la fuente de verdad
    // compartida, localStorage solo evita el flash en el render inicial.
    const fetchPromos = () => {
      supabase.from('daily_promos').select('*').then(({ data, error }) => {
        if (error) { console.warn('[DailyPromo] Supabase read:', error.message); return }
        if (data?.length > 0) {
          applyMap(prev => {
            const map = { ...prev }
            data.forEach(row => { map[row.dia_semana] = rowToPromo(row) })
            return map
          })
        }
      })
    }

    fetchPromos()

    const pollId = setInterval(fetchPromos, 20000)

    const onVisible = () => { if (document.visibilityState === 'visible') fetchPromos() }
    document.addEventListener('visibilitychange', onVisible)

    try {
      bcRef.current = new BroadcastChannel('bombonera_daily_promos')
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === 'promo_update') {
          setPromoMap(prev => ({ ...prev, [e.data.diaSemana]: e.data.promo }))
        }
      }
    } catch {}

    try {
      channelRef.current = supabase
        .channel('daily-promos-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_promos' }, payload => {
          if (payload.new) {
            applyMap(prev => ({ ...prev, [payload.new.dia_semana]: rowToPromo(payload.new) }))
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

  const updatePromo = async (diaSemana, data) => {
    const prevValue = promoMap[diaSemana]
    const nextValue = { ...emptyPromo, ...data }

    applyMap(prev => ({ ...prev, [diaSemana]: nextValue }))
    try { bcRef.current?.postMessage({ type: 'promo_update', diaSemana, promo: nextValue }) } catch {}

    const MAX_INTENTOS = 3
    let lastError = null
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
      try {
        const { error } = await supabase.from('daily_promos').upsert(
          { dia_semana: diaSemana, ...nextValue },
          { onConflict: 'dia_semana' }
        )
        if (!error) return { error: null }
        lastError = error
      } catch (err) {
        lastError = err
      }
      if (intento < MAX_INTENTOS) await new Promise(r => setTimeout(r, 500 * intento))
    }

    console.warn('[DailyPromo] Supabase sync falló tras reintentos:', lastError?.message || lastError)
    applyMap(prev => ({ ...prev, [diaSemana]: prevValue }))
    try { bcRef.current?.postMessage({ type: 'promo_update', diaSemana, promo: prevValue }) } catch {}
    return { error: lastError }
  }

  return (
    <DailyPromoContext.Provider value={{ promoMap, updatePromo }}>
      {children}
    </DailyPromoContext.Provider>
  )
}

export function useDailyPromo() {
  const ctx = useContext(DailyPromoContext)
  if (!ctx) throw new Error('useDailyPromo debe usarse dentro de DailyPromoProvider')
  return ctx
}
