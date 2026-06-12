import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import AktivaApp from './aktiva/AktivaApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AktivaApp />
  </StrictMode>
)
