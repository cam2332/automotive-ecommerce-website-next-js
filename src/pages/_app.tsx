import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import SessionProvider from '../context/SessionContext'
import ToastProvider from '../components/toast/ToastContext'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ToastProvider>
      <SessionProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </SessionProvider>
    </ToastProvider>
  )
}

export default MyApp
