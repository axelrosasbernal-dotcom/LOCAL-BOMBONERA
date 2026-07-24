import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase'
import { products } from '../data/products'

const StockContext = createContext(null)
const LS_KEY = 'bombonera_stock'

const defaultMap = {}
products.forEach(p => { defaultMap[p.id] = true })

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToLS(map) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)) } catch {}
}

export function StockProvider({ children }) {
  const [stockMap, setStockMap] = useState(() => {
    const stored = loadFromLS()
    return stored ? { ...defaultMap, ...stored } : { ...defaultMap }
  })

  const bcRef = useRef(null)
  const channelRef = useRef(null)

  // Actualiza estado Y persiste en localStorage
  const applyMap = (updater) => {
    setStockMap(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveToLS(next)
      return next
    })
  }

  useEffect(() => {
    // Siempre sincronizar desde Supabase: es la fuente de verdad compartida.
    // El localStorage solo sirve para el render inicial (evitar flash), pero Supabase
    // siempre tiene los datos más recientes del admin.
    const fetchStock = () => {
      supabase.from('stock').select('product_id, in_stock').then(({ data, error }) => {
        if (error) { console.warn('[Stock] Supabase read:', error.message); return }
        if (data?.length > 0) {
          applyMap(prev => {
            const map = { ...prev }
            data.forEach(row => { map[row.product_id] = row.in_stock })
            return map
          })
        }
      })
    }

    fetchStock()

    // Poll de respaldo: el Realtime de Supabase no siempre llega en redes
    // móviles, así que refrescamos cada 20s por las dudas.
    const pollId = setInterval(fetchStock, 20000)

    // Al volver a la pestaña (ej: el celular vuelve de segundo plano tras
    // WhatsApp u otra app), refrescar de inmediato en vez de esperar el poll.
    const onVisible = () => { if (document.visibilityState === 'visible') fetchStock() }
    document.addEventListener('visibilitychange', onVisible)

    // BroadcastChannel: sync instantáneo entre pestañas del mismo navegador
    try {
      bcRef.current = new BroadcastChannel('bombonera_stock')
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === 'stock_update') {
          setStockMap(prev => ({ ...prev, [e.data.productId]: e.data.inStock }))
        }
      }
    } catch {}

    // Realtime de Supabase (funciona solo si está habilitado en el dashboard)
    try {
      channelRef.current = supabase
        .channel('stock-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stock' }, payload => {
          if (payload.new) {
            applyMap(prev => ({ ...prev, [payload.new.product_id]: payload.new.in_stock }))
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

  const toggleStock = async (productId) => {
    const newValue = !(stockMap[productId] !== false)

    // Guarda inmediatamente en localStorage — no depende de Supabase
    applyMap(prev => ({ ...prev, [productId]: newValue }))

    // Notifica otras pestañas al instante
    try { bcRef.current?.postMessage({ type: 'stock_update', productId, inStock: newValue }) } catch {}

    // Intenta sincronizar con Supabase (best-effort, no bloquea ni revierte)
    const { error } = await supabase.from('stock').upsert(
      { product_id: productId, in_stock: newValue },
      { onConflict: 'product_id' }
    )
    if (error) console.warn('[Stock] Supabase sync falló (cambio guardado localmente):', error.message)
  }

  return (
    <StockContext.Provider value={{ stockMap, toggleStock }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStock() {
  const ctx = useContext(StockContext)
  if (!ctx) throw new Error('useStock debe usarse dentro de StockProvider')
  return ctx
}
