import { createContext, useContext, useReducer, useState } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, {
        cartId: Date.now() + Math.random(),
        product: action.product,
        quantity: action.quantity,
        customization: action.customization,
      }]
    case 'REMOVE':
      return state.filter(i => i.cartId !== action.cartId)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.cartId === action.cartId ? { ...i, quantity: Math.max(1, action.quantity) } : i
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (product, quantity, customization) => {
    dispatch({ type: 'ADD', product, quantity, customization })
    setIsOpen(true)
  }
  const removeItem  = (cartId)           => dispatch({ type: 'REMOVE', cartId })
  const updateQty   = (cartId, quantity) => dispatch({ type: 'UPDATE_QTY', cartId, quantity })
  const clearCart   = ()                 => dispatch({ type: 'CLEAR' })

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, total, count,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      addItem, removeItem, updateQty, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
