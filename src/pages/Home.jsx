import { useState } from 'react'
import Hero from '../components/sections/Hero'
import Categories from '../components/sections/Categories'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import ContactFooter from '../components/sections/ContactFooter'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <>
      <Hero />
      <Categories activeCategory={activeCategory} onSelect={setActiveCategory} />
      <FeaturedProducts filterCategory={activeCategory} />
      <ContactFooter />
    </>
  )
}
