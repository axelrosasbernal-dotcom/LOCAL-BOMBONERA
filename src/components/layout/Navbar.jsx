import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useSettings } from '../../context/SettingsContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const { count, openCart } = useCart()
  const { settings } = useSettings()
  const cerrado = settings.manual_closed

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍔</span>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>La Bombonera</span>
            <span className={styles.logoSub}>Burguer's</span>
          </span>
        </Link>

        {/* Links desktop */}
        <ul className={`${styles.navLinks} ${open ? styles.navOpen : ''}`}>
          <li><NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.link} onClick={() => setOpen(false)}>Inicio</NavLink></li>
          <li><a href="#categorias" className={styles.link} onClick={() => setOpen(false)}>Menú</a></li>
          <li><a href="#menu" className={styles.link} onClick={() => setOpen(false)}>Destacados</a></li>
          <li><a href="#contacto" className={styles.link} onClick={() => setOpen(false)}>Contacto</a></li>
          <li>
            {cerrado
              ? <span className={styles.ctaMobile} aria-disabled="true">🔴 Cerrado hoy</span>
              : <a href="#menu" className={styles.ctaMobile} onClick={() => setOpen(false)}>🛒 Pedir Ahora</a>
            }
          </li>
        </ul>

        {/* Actions */}
        <div className={styles.actions}>
          <a href="tel:75711571" className={styles.phone}>
            <span>📞</span> 75711571
          </a>

          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={dark ? 'Modo claro' : 'Modo oscuro'}
          >
            {dark ? '🌙' : '☀️'}
          </button>

          <button className={styles.cartBtn} onClick={openCart} aria-label="Abrir carrito">
            🛒
            {count > 0 && <span className={styles.cartCount}>{count}</span>}
          </button>

          {cerrado
            ? <span className={styles.cta} aria-disabled="true">🔴 Cerrado hoy</span>
            : <a href="#menu" className={styles.cta}>Pedir Ahora</a>
          }

          <button
            className={styles.hamburger}
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <span className={`${styles.bar} ${open ? styles.bar1Open : ''}`} />
            <span className={`${styles.bar} ${open ? styles.bar2Open : ''}`} />
            <span className={`${styles.bar} ${open ? styles.bar3Open : ''}`} />
          </button>
        </div>
      </nav>
    </header>
  )
}
