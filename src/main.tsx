import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/AppRoutes'
import { CartProvider } from './state/CartContext'
import { AuthProvider } from './state/AuthContext'
import { ComparisonProvider } from './state/ComparisonContext'
import './styles/tokens.css'
import './styles/global.css'
import './styles/app.css'

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <AuthProvider>
        <ComparisonProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </ComparisonProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
