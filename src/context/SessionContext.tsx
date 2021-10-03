import { createContext, useContext, useEffect, useState } from 'react'
import redaxios from 'redaxios'
import { IUser } from '../DAO/documents/User'
import { Either, left, right } from '../utils/Either'

type SessionContextProps = {
  user: IUser
  token: string
  signUp: (params: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<Either<[string, number], boolean>>
  signIn: (params: {
    email: string
    password: string
  }) => Promise<Either<[string, number], boolean>>
  signOut: () => Promise<void>
}

export const SessionContext = createContext<SessionContextProps>(
  {} as SessionContextProps
)

const SessionProvider: React.FC = ({ children }): React.ReactElement => {
  const [user, setUser] = useState<IUser | undefined>()
  const [token, setToken] = useState<string | undefined>()

  const errorHandler = () => {
    setUser(undefined)
    setToken(undefined)
    sessionStorage.removeItem('jwtToken')
  }

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
          if (response.status === 200) {
            setUser((response.data as any).user)
            setToken((response.data as any).token)
            sessionStorage.setItem('jwtToken', (response.data as any).token)
          } else {
            errorHandler()
          }
        })
        .catch(function (error) {
          errorHandler()
        })
    }
  }, [])

  const signUp = async (params: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<Either<[string, number], boolean>> => {
    try {
      const response = await redaxios.post('/api/users', params)
      if (response.status === 201) {
        setUser(response.data.user)
        setToken(response.data.token)
        sessionStorage.setItem('jwtToken', response.data.token)
        return right(true)
      } else {
        errorHandler()
        return left(['Rejestracja nieudana', -1])
      }
    } catch (error) {
      errorHandler()
      if (error.status === 409) {
        return left(['E-mail w użyciu.', 409])
      } else {
        return left(['Rejestracja nieudana', -1])
      }
    }
  }

  const signIn = async (params: {
    email: string
    password: string
  }): Promise<Either<[string, number], boolean>> => {
    try {
      const response = await redaxios.post('/api/sessions', params)
      if (response.status === 200) {
        setUser(response.data.user)
        setToken(response.data.token)
        sessionStorage.setItem('jwtToken', response.data.token)
        return right(true)
      } else {
        errorHandler()
        return left(['Logowanie nieudane.', -1])
      }
    } catch (error) {
      errorHandler()
      if (error.status === 404) {
        return left(['Nie znaleziono podanego adresu e-mail.', 404])
      } else if (error.status === 401) {
        return left(['Nieprawidłowe hasło.', 401])
      } else {
        return left(['Logowanie nieudane.', -1])
      }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await redaxios.delete('/api/sessions')
      errorHandler()
    } catch (error) {
      errorHandler()
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