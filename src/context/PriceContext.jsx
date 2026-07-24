import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase'
import { products } from '../data/products'

const PriceContext = createContext(null)
const LS_KEY = 'bombonera_prices'

const defaultMap = {}
products.forEach(p => { defaultMap[p.id] = p.price })

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToLS(map) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)) } catch {}
}

export function PriceProvider({ children }) {
  const [priceMap, setPriceMap] = useState(() => {
    const stored = loadFromLS()
    return stored ? { ...defaultMap, ...stored } : { ...defaultMap }
  })

  const bcRef = useRef(null)
  const channelRef = useRef(null)

  const applyMap = (updater) => {
    setPriceMap(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveToLS(next)
      return next
    })
  }

  useEffect(() => {
    // Igual que StockContext: Supabase es la fuente de verdad compartida,
    // localStorage solo evita el flash en el render inicial.
    const fetchPrices = () => {
      supabase.from('prices').select('product_id, price').then(({ data, error }) => {
        if (error) { console.warn('[Prices] Supabase read:', error.message); return }
        if (data?.length > 0) {
          applyMap(prev => {
            const map = { ...prev }
            data.forEach(row => { map[row.product_id] = row.price })
            return map
          })
        }
      })
    }

    fetchPrices()

    const pollId = setInterval(fetchPrices, 20000)

    const onVisible = () => { if (document.visibilityState === 'visible') fetchPrices() }
    document.addEventListener('visibilitychange', onVisible)

    try {
      bcRef.current = new BroadcastChannel('bombonera_prices')
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === 'price_update') {
          setPriceMap(prev => ({ ...prev, [e.data.productId]: e.data.price }))
        }
      }
    } catch {}

    try {
      channelRef.current = supabase
        .channel('prices-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'prices' }, payload => {
          if (payload.new) {
            applyMap(prev => ({ ...prev, [payload.new.product_id]: payload.new.price }))
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

  const updatePrice = async (productId, newPrice) => {
    const prevValue = priceMap[productId]

    applyMap(prev => ({ ...prev, [productId]: newPrice }))
    try { bcRef.current?.postMessage({ type: 'price_update', productId, price: newPrice }) } catch {}

    const MAX_INTENTOS = 3
    let lastError = null
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
      try {
        const { error } = await supabase.from('prices').upsert(
          { product_id: productId, price: newPrice },
          { onConflict: 'product_id' }
        )
        if (!error) return { error: null }
        lastError = error
      } catch (err) {
        lastError = err
      }
      if (intento < MAX_INTENTOS) await new Promise(r => setTimeout(r, 500 * intento))
    }

    console.warn('[Prices] Supabase sync falló tras reintentos:', lastError?.message || lastError)
    applyMap(prev => ({ ...prev, [productId]: prevValue }))
    try { bcRef.current?.postMessage({ type: 'price_update', productId, price: prevValue }) } catch {}
    return { error: lastError }
  }

  return (
    <PriceContext.Provider value={{ priceMap, updatePrice }}>
      {children}
    </PriceContext.Provider>
  )
}

export function usePrices() {
  const ctx = useContext(PriceContext)
  if (!ctx) throw new Error('usePrices debe usarse dentro de PriceProvider')
  return ctx
}
