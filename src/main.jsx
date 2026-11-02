import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './lib/registerServiceWorker.js'

// index.html aporta el <div id="root">; React dibuja toda la app dentro de él.
createRoot(document.getElementById('root')).render(
  // StrictMode ayuda a detectar efectos y renderizados problemáticos en desarrollo.
  <StrictMode>
    <App />
  </StrictMode>,
)

// La PWA se registra aparte: no forma parte del árbol de componentes de React.
registerServiceWorker()
