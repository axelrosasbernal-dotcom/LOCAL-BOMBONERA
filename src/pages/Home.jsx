import { useState } from 'react'
import Hero from '../components/sections/Hero'
import Categories from '../components/sections/Categories'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import Promos from '../components/sections/Promos'
import Horario from '../components/sections/Horario'
import Ubicacion from '../components/sections/Ubicacion'
import ContactFooter from '../components/sections/ContactFooter'
import Cart from '../components/ui/Cart'
import WhatsAppFloat from '../components/ui/WhatsAppFloat'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <>
      <Hero />
      <Categories activeCategory={activeCategory} onSelect={setActiveCategory} />
      <FeaturedProducts filterCategory={activeCategory} />
      <Promos />
      <Horario />
      <Ubicacion />
      <ContactFooter />
      <Cart />
      <WhatsAppFloat />
    </>
  )
}
