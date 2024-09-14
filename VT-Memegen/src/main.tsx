import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Register from './Components/Register/Register.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Register />
  </StrictMode>,
)
