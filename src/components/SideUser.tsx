/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router'
import { useAppContext } from '../context/AppContext'
import { useSessionContext } from '../context/SessionContext'
import SideMenu from './SideMenu'

function SideUser() {
  const router = useRouter()
  const appContext = useAppContext()
  const sessionContext = useSessionContext()

  const onClose = () => {
    appContext.setSideUserVisible(false)
  }

  return (
    <SideMenu
      title='Moje konto'
      isRight
      onClose={onClose}
      visible={appContext.sideUserVisible}>
      {sessionContext.user ? (
        <ul className='flex flex-col justify-between space-y-4'>
          <li
            className='cursor-pointer'
            onClick={async () => {
              await sessionContext.signOut()
              router.push('/')
              appContext.setSideUserVisible(false)
            }}>
            <span>Wyloguj</span>
          </li>
        </ul>
      ) : (
        <ul className='flex flex-col justify-between space-y-4'>
          <li
            className='cursor-pointer'
            onClick={() => {
              router.push('/account/login')
              appContext.setSideUserVisible(false)
            }}>
            <span>Zaloguj</span>
          </li>
          <li
            className='cursor-pointer'
            onClick={() => {
              router.push('/account/register')
              appContext.setSideUserVisible(false)
            }}>
            <span>Rejestracja</span>
          </li>
        </ul>
      )}
    </SideMenu>
  )
}

export default SideUser
