import { useRouter } from 'next/router'
import { useAppContext } from '../context/AppContext'
import Header from './Header'

interface IMainHeaderProps {
  onClickMenu: () => void
  onClickWishList: () => void
  onClickShoppingCart: () => void
  onClickUser: () => void
}

function MainHeader({
  onClickMenu,
  onClickWishList,
  onClickShoppingCart,
  onClickUser,
}: IMainHeaderProps) {
  const router = useRouter()
  const appContext = useAppContext()
  return (
    <Header
      logoText={'Auto części'}
      onClickLogo={() => router.push('/')}
      searchBarInputPlaceholder='Wyszukaj w sklepie'
      searchText={appContext.searchText}
      onChangeSearchText={appContext.setSearchText}
      searchBarVisible={true}
      searchIconVisible={false}
      onClickMenu={onClickMenu}
      menuIconVisible={true}
      wishListCount={appContext.wishListCount}
      onClickWishList={onClickWishList}
      wishListIconVisible={true}
      cartCount={appContext.cartCount}
      cartTotal={appContext.cartTotal}
      onClickShoppingCart={onClickShoppingCart}
      cartIconVisible={true}
      onClickUser={onClickUser}
      userIconVisible={true}
    />
  )
}

export default MainHeader
