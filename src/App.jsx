import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { StockProvider } from './context/StockContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'

export default function App() {
  return (
    <ThemeProvider>
      <StockProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </StockProvider>
    </ThemeProvider>
  )
}
