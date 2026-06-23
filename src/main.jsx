import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#fff', background: '#060d1e', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#F5C500', marginBottom: '1rem' }}>Error de la aplicación</h1>
          <pre style={{ background: '#0d1a38', padding: '1rem', borderRadius: '8px', overflow: 'auto', color: '#ff6b6b' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
