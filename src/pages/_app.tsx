import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import SessionProvider from '../context/SessionContext'
import ToastProvider from '../context/ToastContext'
import CartProvider from '../context/CartContext'
import WishListProvider from '../context/WishListContext'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ToastProvider>
      <SessionProvider>
        <CartProvider>
          <WishListProvider>
            <AppProvider>
              <Component {...pageProps} />
            </AppProvider>
          </WishListProvider>
        </CartProvider>
      </SessionProvider>
    </ToastProvider>
  )
}

export default MyApp
