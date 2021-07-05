import { useRouter } from 'next/router'
import SideMenu from './SideMenu'
function SideUser({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const router = useRouter()

  return (
    <SideMenu
      title={'Moje konto'}
      isRight={true}
      onClose={onClose}
      visible={visible}>
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
    </SideMenu>
  )
}

export default SideUser
