import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { products } from '../data/products'

const StockContext = createContext(null)

const initialMap = {}
products.forEach(p => { initialMap[p.id] = true })

export function StockProvider({ children }) {
  const [stockMap, setStockMap] = useState(initialMap)

  useEffect(() => {
    supabase.from('stock').select('product_id, in_stock').then(({ data, error }) => {
      if (error) return
      if (data && data.length > 0) {
        setStockMap(prev => {
          const map = { ...prev }
          data.forEach(row => { map[row.product_id] = row.in_stock })
          return map
        })
      }
    }).catch(() => {})

    let channel
    try {
      channel = supabase
        .channel('stock-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stock' }, payload => {
          if (payload.new) {
            setStockMap(prev => ({ ...prev, [payload.new.product_id]: payload.new.in_stock }))
          }
        })
        .subscribe()
    } catch (_) {}

    return () => { if (channel) supabase.removeChannel(channel) }
  }, [])

  const toggleStock = async (productId) => {
    const newValue = !stockMap[productId]
    setStockMap(prev => ({ ...prev, [productId]: newValue }))
    await supabase.from('stock').upsert(
      { product_id: productId, in_stock: newValue },
      { onConflict: 'product_id' }
    )
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
