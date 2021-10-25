import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import SessionProvider from '../context/SessionContext'
import ToastProvider from '../context/ToastContext'
import CartProvider from '../context/CartContext'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ToastProvider>
      <SessionProvider>
        <CartProvider>
          <AppProvider>
            <Component {...pageProps} />
          </AppProvider>
        </CartProvider>
      </SessionProvider>
    </ToastProvider>
  )
}

export default MyApp
