import { useRouter } from 'next/router'
import { useAppContext } from '../context/AppContext'
import { useCartContext } from '../context/CartContext'
import { useWishListContext } from '../context/WishListContext'
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
  const cartContext = useCartContext()
  const wishListContext = useWishListContext()

  return (
    <Header
      logoText={'Auto części'}
      onClickLogo={() => router.push('/')}
      searchBarInputPlaceholder='Wyszukaj w sklepie'
      searchText={appContext.searchText}
      onChangeSearchText={appContext.setSearchText}
      searchBarVisible
      searchIconVisible={false}
      onClickMenu={onClickMenu}
      menuIconVisible
      wishListCount={wishListContext.numberOfProducts}
      onClickWishList={onClickWishList}
      wishListIconVisible
      cartCount={cartContext.numberOfProducts}
      cartTotal={cartContext.total}
      onClickShoppingCart={onClickShoppingCart}
      cartIconVisible
      onClickUser={onClickUser}
      userIconVisible
    />
  )
}

export default MainHeader
