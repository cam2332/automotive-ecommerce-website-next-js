/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router'
import { useSessionContext } from '../context/SessionContext'
import SideMenu from './SideMenu'

function SideUser({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const router = useRouter()
  const sessionContext = useSessionContext()

  return (
    <SideMenu title={'Moje konto'} isRight onClose={onClose} visible={visible}>
      {sessionContext.user ? (
        <ul className='flex flex-col justify-between space-y-4'>
          <li
            className='cursor-pointer'
            onClick={async () => {
              await sessionContext.signOut()
              router.push('/')
            }}>
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
