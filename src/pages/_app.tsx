import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import SessionProvider from '../context/SessionContext'
import ToastProvider from '../context/ToastContext'
import CartProvider from '../context/CartContext'
import WishListProvider from '../context/WishListContext'
import SearchProvider from '../context/SearchContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <SessionProvider>
        <CartProvider>
          <WishListProvider>
            <SearchProvider>
              <AppProvider>
                <Component {...pageProps} />
              </AppProvider>
            </SearchProvider>
          </WishListProvider>
        </CartProvider>
      </SessionProvider>
    </ToastProvider>
  )
}

export default MyApp
