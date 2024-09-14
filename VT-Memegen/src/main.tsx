import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './Contexts/AuthContext.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthWrapper from './Components/AuthWrapper/AuthWrapper.tsx'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <AuthProvider>
        <AuthWrapper/>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
