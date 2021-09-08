import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import AppProvider from '../context/AppContext'

const queryClient = new QueryClient()
import SessionProvider from '../context/SessionContext'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
