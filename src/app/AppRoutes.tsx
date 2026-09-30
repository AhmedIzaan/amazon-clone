import { Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { CheckoutSuccessPage } from '../pages/CheckoutSuccessPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProductPage } from '../pages/ProductPage'
import { SearchPage } from '../pages/SearchPage'
import { SignInPage } from '../pages/SignInPage'
import { CreateAccountPage } from '../pages/CreateAccountPage'
import { AccountPage } from '../pages/AccountPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="products/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="create-account" element={<CreateAccountPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
