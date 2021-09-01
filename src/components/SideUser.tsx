import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import redaxios from 'redaxios'
import { useAppContext } from '../context/AppContext'
import SideMenu from './SideMenu'

function SideUser({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const appContext = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken')
    if (token && token.length > 0) {
      redaxios
        .get('/api/sessions', {
          headers: {
            authorization: token,
          },
        })
        .then(function (response) {
          appContext.setUser((response.data as any).user)
          sessionStorage.setItem('jwtToken', (response.data as any).token)
        })
        .catch(function (error) {
          appContext.setUser(undefined)
          sessionStorage.removeItem('jwtToken')
          router.push('/')
        })
    }
  }, [])

  const signOut = () =>
    redaxios
      .delete('/api/sessions')
      .then(function (response) {
        appContext.setUser(undefined)
        sessionStorage.removeItem('jwtToken')
        router.push('/')
      })
      .catch(function (error) {
        appContext.setUser(undefined)
        sessionStorage.removeItem('jwtToken')
        router.push('/')
      })

  return (
    <SideMenu
      title={'Moje konto'}
      isRight={true}
      onClose={onClose}
      visible={visible}>
      {appContext.user ? (
        <ul className='flex flex-col justify-between space-y-4'>
          <li className='cursor-pointer' onClick={() => signOut()}>
            <span>Wyloguj</span>
          </li>
        </ul>
      ) : (
        <ul className='flex flex-col justify-between space-y-4'>
          <li
            className='cursor-pointer'
            onClick={() => router.push('/account/login')}>
            <span>Zaloguj</span>
          </li>
          <li
            className='cursor-pointer'
            onClick={() => router.push('/account/register')}>
            <span>Rejestracja</span>
          </li>
        </ul>
      )}
    </SideMenu>
  )
}

export default SideUser
