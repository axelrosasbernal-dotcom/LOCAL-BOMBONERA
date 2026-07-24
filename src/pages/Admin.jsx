import { useState } from 'react'
import { useStock } from '../context/StockContext'
import { usePrices } from '../context/PriceContext'
import { useSettings } from '../context/SettingsContext'
import { products } from '../data/products'
import styles from './Admin.module.css'

const ADMIN_PASSWORD = 'bombonera2024'

export default function Admin() {
  const { stockMap, toggleStock } = useStock()
  const { priceMap, updatePrice } = usePrices()
  const { settings, updateSettings } = useSettings()
  const [autenticado, setAutenticado] = useState(
    () => localStorage.getItem('admin_auth') === 'ok'
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState(null)
  const [syncError, setSyncError] = useState('')
  const [editingPrice, setEditingPrice] = useState(null)
  const [priceDraft, setPriceDraft] = useState('')
  const [savingPrice, setSavingPrice] = useState(null)
  const [priceError, setPriceError] = useState('')
  const [savingClosed, setSavingClosed] = useState(false)
  const [horarioDraft, setHorarioDraft] = useState(null)
  const [savingHorario, setSavingHorario] = useState(false)
  const [horarioError, setHorarioError] = useState('')

  const handleToggleClosed = async () => {
    setSavingClosed(true)
    await updateSettings({ manual_closed: !settings.manual_closed })
    setSavingClosed(false)
  }

  const startEditHorario = () => {
    setHorarioDraft({
      apertura: settings.apertura,
      cierre: settings.cierre,
      horario_label: settings.horario_label,
    })
    setHorarioError('')
  }

  const cancelEditHorario = () => setHorarioDraft(null)

  const handleSaveHorario = async () => {
    if (!horarioDraft.apertura || !horarioDraft.cierre || !horarioDraft.horario_label.trim()) {
      setHorarioError('Completá todos los campos.')
      return
    }
    setSavingHorario(true)
    setHorarioError('')
    const { error } = await updateSettings(horarioDraft)
    setSavingHorario(false)
    if (error) {
      setHorarioError('No se pudo guardar el horario. Revisá tu conexión e intentá de nuevo.')
    } else {
      setHorarioDraft(null)
    }
  }

  const startEditPrice = (product) => {
    setEditingPrice(product.id)
    setPriceDraft(String(priceMap[product.id] ?? product.price))
    setPriceError('')
  }

  const cancelEditPrice = () => {
    setEditingPrice(null)
    setPriceDraft('')
  }

  const handleSavePrice = async (productId) => {
    const newPrice = Number(priceDraft)
    if (!priceDraft.trim() || Number.isNaN(newPrice) || newPrice <= 0) {
      setPriceError('Ingresá un precio válido.')
      return
    }
    setSavingPrice(productId)
    setPriceError('')
    try {
      const { error } = await updatePrice(productId, newPrice)
      if (error) {
        setPriceError('No se pudo guardar el precio en el servidor. Revisá tu conexión e intentá de nuevo.')
      } else {
        setEditingPrice(null)
      }
    } catch {
      setPriceError('No se pudo guardar el precio en el servidor. Revisá tu conexión e intentá de nuevo.')
    } finally {
      setSavingPrice(null)
    }
  }

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
    try {
      const { error } = await toggleStock(productId)
      if (error) {
        setSyncError('No se pudo guardar el cambio en el servidor. Revisá tu conexión e intentá de nuevo.')
      }
    } catch {
      setSyncError('No se pudo guardar el cambio en el servidor. Revisá tu conexión e intentá de nuevo.')
    } finally {
      setToggling(null)
    }
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
          <h2 className={styles.sectionTitle}>Estado del local</h2>
          <div className={styles.productRow}>
            <div className={styles.productInfo}>
              <span className={styles.productName}>
                {settings.manual_closed ? '🔴 Local cerrado' : '🟢 Local abierto'}
              </span>
              <span className={styles.productMeta}>
                Al marcarlo "cerrado" se oculta el botón de pedido en toda la web (para feriados, falta de insumos, etc.)
              </span>
            </div>
            <button
              className={`${styles.toggleBtn} ${settings.manual_closed ? styles.btnMarkAvail : styles.btnMarkOut}`}
              onClick={handleToggleClosed}
              disabled={savingClosed}
            >
              {savingClosed
                ? 'Guardando...'
                : settings.manual_closed
                  ? '🟢 Reabrir local'
                  : '🔴 Cerrar local hoy'
              }
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Horario de atención</h2>
          <div className={styles.productRow}>
            <div className={styles.productInfo}>
              {horarioDraft ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>
                    Días: <input
                      type="text"
                      value={horarioDraft.horario_label}
                      onChange={e => setHorarioDraft(d => ({ ...d, horario_label: e.target.value }))}
                      style={{ padding: '0.25rem 0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </label>
                  <label>
                    Apertura: <input
                      type="time"
                      value={horarioDraft.apertura}
                      onChange={e => setHorarioDraft(d => ({ ...d, apertura: e.target.value }))}
                      style={{ padding: '0.25rem 0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </label>
                  <label>
                    Cierre: <input
                      type="time"
                      value={horarioDraft.cierre}
                      onChange={e => setHorarioDraft(d => ({ ...d, cierre: e.target.value }))}
                      style={{ padding: '0.25rem 0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </label>
                  {horarioError && <span style={{ color: '#991b1b', fontSize: '0.85rem' }}>{horarioError}</span>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className={styles.toggleBtn} onClick={handleSaveHorario} disabled={savingHorario}>
                      {savingHorario ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" className={styles.toggleBtn} onClick={cancelEditHorario} disabled={savingHorario}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className={styles.productName}>{settings.horario_label}</span>
                  <span className={styles.productMeta}>{settings.apertura} – {settings.cierre}</span>
                </>
              )}
            </div>
            {!horarioDraft && (
              <button className={styles.toggleBtn} onClick={startEditHorario}>
                ✏️ Editar horario
              </button>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stock de productos</h2>
          <div className={styles.productList}>
            {products.map(product => {
              const inStock = stockMap[product.id] !== false
              const isToggling = toggling === product.id
              const currentPrice = priceMap[product.id] ?? product.price
              const isEditingPrice = editingPrice === product.id
              const isSavingPrice = savingPrice === product.id

              return (
                <div
                  key={product.id}
                  className={`${styles.productRow} ${!inStock ? styles.rowOutOfStock : ''}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImg}
                    onError={e => { e.target.src = '/images/hero-banner.webp' }}
                  />
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productMeta}>
                      {product.category}
                      {!isEditingPrice && (
                        <>
                          {' · '}{currentPrice} Bs.{' '}
                          <button
                            type="button"
                            onClick={() => startEditPrice(product)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit', padding: 0, font: 'inherit' }}
                          >
                            ✏️ editar
                          </button>
                        </>
                      )}
                    </span>
                    {isEditingPrice && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={priceDraft}
                          onChange={e => setPriceDraft(e.target.value)}
                          style={{ width: '5.5rem', padding: '0.25rem 0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                          autoFocus
                        />
                        <span>Bs.</span>
                        <button
                          type="button"
                          onClick={() => handleSavePrice(product.id)}
                          disabled={isSavingPrice}
                          className={styles.toggleBtn}
                        >
                          {isSavingPrice ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" onClick={cancelEditPrice} disabled={isSavingPrice} className={styles.toggleBtn}>
                          Cancelar
                        </button>
                      </div>
                    )}
                    {isEditingPrice && priceError && (
                      <span style={{ color: '#991b1b', fontSize: '0.85rem' }}>{priceError}</span>
                    )}
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
