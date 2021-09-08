import { createContext, useContext, useEffect, useState } from 'react'
import redaxios from 'redaxios'
import { IUser } from '../DAO/documents/User'

type SessionContextProps = {
  user: IUser
  token: string
  signUp: (params: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<boolean>
  signIn: (params: { email: string; password: string }) => Promise<boolean>
  signOut: () => Promise<void>
}

export const SessionContext = createContext<SessionContextProps>(
  {} as SessionContextProps
)

const SessionProvider: React.FC = ({ children }): React.ReactElement => {
  const [user, setUser] = useState<IUser | undefined>()
  const [token, setToken] = useState<string | undefined>()

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken')
    if (token && token.length > 0) {
      setToken(token)
      redaxios
        .get('/api/sessions', {
          headers: {
            authorization: token,
          },
        })
        .then(function (response) {
          setUser((response.data as any).user)
          setToken((response.data as any).token)
          sessionStorage.setItem('jwtToken', (response.data as any).token)
        })
        .catch(function (error) {
          setUser(undefined)
          setToken(undefined)
          sessionStorage.removeItem('jwtToken')
        })
    }
  }, [])

  const signUp = async (params: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<boolean> => {
    try {
      const response = await redaxios.post('/api/users', params)
      setUser(response.data.user)
      setToken(response.data.token)
      sessionStorage.setItem('jwtToken', response.data.token)
      return true
    } catch {
      setUser(undefined)
      setToken(undefined)
      sessionStorage.removeItem('jwtToken')
      return false
    }
  }

  const signIn = async (params: {
    email: string
    password: string
  }): Promise<boolean> => {
    try {
      const response = await redaxios.post('/api/sessions', params)
      console.log(response)
      setUser(response.data.user)
      setToken(response.data.token)
      sessionStorage.setItem('jwtToken', response.data.token)
      return true
    } catch {
      setUser(undefined)
      setToken(undefined)
      sessionStorage.removeItem('jwtToken')
      return false
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await redaxios.delete('/api/sessions')
      setUser(undefined)
      setToken(undefined)
      sessionStorage.removeItem('jwtToken')
    } catch {
      setUser(undefined)
      setToken(undefined)
      sessionStorage.removeItem('jwtToken')
    }
  }

  return (
    <SessionContext.Provider
      value={{
        user: user,
        token: token,
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
      }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const state = useContext(SessionContext)

  if (state === undefined) {
    throw new Error('useSessionState must be used within an SessionProvider')
  }

  return state
}

export default SessionProvider
