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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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
