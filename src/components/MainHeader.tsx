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
      searchBarVisible={true}
      searchIconVisible={false}
      onClickMenu={onClickMenu}
      menuIconVisible={true}
      wishListCount={wishListContext.numberOfProducts}
      onClickWishList={onClickWishList}
      wishListIconVisible={true}
      cartCount={cartContext.numberOfProducts}
      cartTotal={cartContext.total}
      onClickShoppingCart={onClickShoppingCart}
      cartIconVisible={true}
      onClickUser={onClickUser}
      userIconVisible={true}
    />
  )
}

export default MainHeader
