import { useAppContext } from '../context/AppContext'
import { useCartContext } from '../context/CartContext'
import { useSearchContext } from '../context/SearchContext'
import { useWishListContext } from '../context/WishListContext'
import Header from './Header'

interface IMainHeaderProps {
  onClickMenu: () => void
  onClickWishList: () => void
  onClickShoppingCart: () => void
  onClickUser: () => void
  onClickSearchIcon: () => void
}

function MainHeader({
  onClickMenu,
  onClickWishList,
  onClickShoppingCart,
  onClickUser,
  onClickSearchIcon,
}: IMainHeaderProps) {
  const cartContext = useCartContext()
  const wishListContext = useWishListContext()
  const searchContext = useSearchContext()
  const appContext = useAppContext()

  return (
    <Header
      logoText='Auto części'
      searchBarInputPlaceholder='Wyszukaj w sklepie'
      searchText={searchContext.searchText}
      onChangeSearchText={searchContext.search}
      onSearchBarFocus={() => appContext.setSearchResultModalVisible(true)}
      searchBarVisible
      searchIconVisible
      onClickSearchIcon={onClickSearchIcon}
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
