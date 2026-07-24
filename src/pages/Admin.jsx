import { useState } from 'react'
import { useStock } from '../context/StockContext'
import { products } from '../data/products'
import styles from './Admin.module.css'

const ADMIN_PASSWORD = 'bombonera2024'

export default function Admin() {
  const { stockMap, toggleStock } = useStock()
  const [autenticado, setAutenticado] = useState(
    () => localStorage.getItem('admin_auth') === 'ok'
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState(null)
  const [syncError, setSyncError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'ok')
      setAutenticado(true)
    } else {
      setError('Contraseña incorrecta.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setAutenticado(false)
  }

  const handleToggle = async (productId) => {
    setToggling(productId)
    setSyncError('')
    const { error } = await toggleStock(productId)
    if (error) {
      setSyncError('No se pudo guardar el cambio en el servidor. Revisá tu conexión e intentá de nuevo.')
    }
    setToggling(null)
  }

  if (!autenticado) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>🍔</div>
          <h1 className={styles.loginTitle}>Panel Administrativo</h1>
          <p className={styles.loginSub}>Burguer's La Bombonera</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              className={styles.input}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
            />
            {error && <p className={styles.loginError}>{error}</p>}
            <button type="submit" className={styles.loginBtn}>
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const disponibles = products.filter(p => stockMap[p.id] !== false).length
  const sinStock = products.length - disponibles

  return (
    <div className={styles.adminPage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerLogo}>🍔</span>
          <div>
            <h1 className={styles.headerTitle}>Panel Administrativo</h1>
            <p className={styles.headerSub}>Burguer's La Bombonera</p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </header>

      <main className={styles.main}>
        {syncError && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem',
            borderRadius: '8px', marginBottom: '1rem', fontWeight: 500,
          }}>
            ⚠️ {syncError}
          </div>
        )}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{disponibles}</span>
            <span className={styles.statLabel}>🟢 Disponibles</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{sinStock}</span>
            <span className={styles.statLabel}>🔴 Sin stock</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{products.length}</span>
            <span className={styles.statLabel}>Total productos</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stock de productos</h2>
          <div className={styles.productList}>
            {products.map(product => {
              const inStock = stockMap[product.id] !== false
              const isToggling = toggling === product.id

              return (
                <div
                  key={product.id}
                  className={`${styles.productRow} ${!inStock ? styles.rowOutOfStock : ''}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImg}
                    onError={e => { e.target.src = '/images/hero-banner.jpg' }}
                  />
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productMeta}>
                      {product.category} · {product.price} Bs.
                    </span>
                  </div>
                  <span className={`${styles.stockBadge} ${inStock ? styles.badgeAvail : styles.badgeOut}`}>
                    {inStock ? '🟢 Disponible' : '🔴 Sin stock'}
                  </span>
                  <button
                    className={`${styles.toggleBtn} ${inStock ? styles.btnMarkOut : styles.btnMarkAvail}`}
                    onClick={() => handleToggle(product.id)}
                    disabled={isToggling}
                  >
                    {isToggling
                      ? 'Guardando...'
                      : inStock
                        ? '🔴 Marcar sin stock'
                        : '🟢 Marcar disponible'
                    }
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
