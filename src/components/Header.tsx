import Link from 'next/link'
import tw from 'tailwind-styled-components'
import {
  IoMenuSharp,
  IoCartSharp,
  IoSearchSharp,
  IoHeartOutline,
  IoPersonCircleSharp,
} from 'react-icons/io5'
import { FaPhoneAlt } from 'react-icons/fa'

interface IHeaderProps {
  logoText?: string
  searchBarVisible?: boolean
  searchBarInputPlaceholder?: string
  searchText?: string
  onChangeSearchText?: (text: string) => void
  onSearchBarFocus?: () => void
  contactPhoneNumber?: string
  menuIconVisible?: boolean
  onClickMenu?: () => void
  onClickSearchIcon?: () => void
  wishListCount?: number
  onClickWishList?: () => void
  cartCount?: number
  cartTotal?: number
  onClickShoppingCart?: () => void
  onClickUser?: () => void
  contactInfoVisible?: boolean
  searchIconVisible?: boolean
  wishListIconVisible?: boolean
  cartIconVisible?: boolean
  userIconVisible?: boolean
}

function Header({
  logoText,
  searchBarVisible,
  searchBarInputPlaceholder,
  searchText,
  onChangeSearchText,
  onSearchBarFocus,
  contactPhoneNumber,
  menuIconVisible,
  onClickMenu,
  onClickSearchIcon,
  wishListCount,
  onClickWishList,
  cartCount,
  cartTotal,
  onClickShoppingCart,
  onClickUser,
  contactInfoVisible,
  searchIconVisible,
  wishListIconVisible,
  cartIconVisible,
  userIconVisible,
}: IHeaderProps) {
  return (
    <Container>
      <Navigation>
        <LeftSide>
          {menuIconVisible && <MenuIcon onClick={onClickMenu} />}
          <Link key='smallLogoText' href='/' passHref>
            <LogoTextSmall>{logoText}</LogoTextSmall>
          </Link>
          <Link key='LargeLogoText' href='/' passHref>
            <LogoTextLarge>{logoText}</LogoTextLarge>
          </Link>
          {searchBarVisible && (
            <SearchBar>
              <SearchBarInput
                type='text'
                placeholder={searchBarInputPlaceholder}
                value={searchText}
                onChange={(e) => onChangeSearchText(e.target.value)}
                onFocus={() => onSearchBarFocus()}
              />
              <SearchBarIcon />
            </SearchBar>
          )}
          {contactInfoVisible && contactPhoneNumber && (
            <ContactInfoWrapper>
              <PhoneIcon />
              <PhoneNumber>{contactPhoneNumber}</PhoneNumber>
            </ContactInfoWrapper>
          )}
        </LeftSide>
        <RightSide>
          {searchIconVisible && <SearchIcon onClick={onClickSearchIcon} />}
          {wishListIconVisible && (
            <WishListContainer onClick={onClickWishList}>
              <HeartIcon />
              <WishListCountPill>{wishListCount}</WishListCountPill>
            </WishListContainer>
          )}
          {cartIconVisible && (
            <CartContainer onClick={onClickShoppingCart}>
              <CartSubContainer>
                <CartIcon />
                <CartCountPill>{cartCount}</CartCountPill>
              </CartSubContainer>
              <CartTotal>{`${cartTotal
                .toFixed(2)
                .replace('.', ',')} zł`}</CartTotal>
            </CartContainer>
          )}
          {userIconVisible && <PersonCircleIcon onClick={onClickUser} />}
        </RightSide>
      </Navigation>
    </Container>
  )
}

const Container = tw.header`
  fixed
  top-0
  left-0
  z-50
  w-full
  bg-white
  shadow-md

  lg:flex
  lg:justify-center
`

const Navigation = tw.nav`
  flex
  flex-row
  items-center
  justify-between
  h-12
  mx-4
  duration-300

  lg:h-16
  lg:w-5xl
  lg:max-w-5xl

  xl:w-[1280px] 
  xl:max-w-[1280px] 
`

const LeftSide = tw.div`
  flex
  flex-row
  items-center
`

const MenuIcon = tw(IoMenuSharp)`
  mr-3
  text-2xl
  cursor-pointer
  text-primary-color
  
  lg:hidden
`

const LogoTextSmall = tw.a`
  text-lg
  font-semibold
  whitespace-nowrap
  uppercase
  cursor-pointer
  text-primary-color

  lg:hidden
`

const LogoTextLarge = tw.a`
  hidden
  text-xl
  font-semibold
  whitespace-nowrap
  uppercase
  cursor-pointer
  text-primary-color

  lg:flex
  lg:mr-3
`

const SearchBar = tw.div`
  hidden
  flex-row
  items-center
  border-2
  rounded-full

  md:flex
  md:ml-3
`

const SearchBarIcon = tw(IoSearchSharp)`
  my-1
  mr-1
  
  text-2xl
  cursor-pointer
  text-primary-color
  max-h-4
  max-w-4

  lg:max-h-5
  lg:max-w-5
  lg:my-2
  lg:mr-3
  lg:ml-1
`

const SearchBarInput = tw.input`
  mr-1
  ml-3
  w-90%
  text-primary-color
  text-sm
  lg:text-base
`

const ContactInfoWrapper = tw.div`
  flex
  flex-row
  items-center
  space-x-3
`

const PhoneIcon = tw(FaPhoneAlt)`
  text-xl
  cursor-pointer
  text-primary-color
  ml-3
  mr-1
`

const PhoneNumber = tw.span`
  text-lg
  font-semibold
  text-primary-color
`

const RightSide = tw.div`
  flex
  flex-row
  items-center
  space-x-6
  
`

const SearchIcon = tw(IoSearchSharp)`
  text-lg
  cursor-pointer
  text-primary-color
  
  md:hidden
`

const WishListContainer = tw.div`
  relative
  cursor-pointer
  mx-3
`

const HeartIcon = tw(IoHeartOutline)`
  text-lg
  text-primary-color
`

const WishListCountPill = tw.span`
  absolute
  flex
  flex-col
  items-center
  w-4
  h-4
  bottom-3
  left-4
  rounded-full
  text-xs
  text-white
  bg-primary-color
`

const CartContainer = tw.div`
  flex
  flex-row
  items-center
  space-x-4
  cursor-pointer
`
const CartSubContainer = tw.div`
  relative
`

const CartCountPill = tw.span`
  absolute
  flex
  flex-col
  items-center
  w-4
  h-4
  bottom-3
  left-4
  rounded-full
  text-xs
  text-white
  bg-primary-color
`

const CartTotal = tw.span`
  text-lg
  font-medium
  text-primary-color
  whitespace-nowrap
`

const CartIcon = tw(IoCartSharp)`
  text-xl
  text-primary-color
`

const PersonCircleIcon = tw(IoPersonCircleSharp)`
  text-2xl
  cursor-pointer
  text-primary-color
`

export default Header
