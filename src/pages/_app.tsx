import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import SessionProvider from '../context/SessionContext'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SessionProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </SessionProvider>
  )
}

export default MyApp
