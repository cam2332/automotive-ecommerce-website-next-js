import { useRouter } from 'next/router'
import { IoTrashOutline } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import Image from 'next/image'
import SideMenu from './SideMenu'
import { useCartContext } from '../context/CartContext'
import Button from './Button'
import { useAppContext } from '../context/AppContext'

function SideShoppingList() {
  const router = useRouter()
  const appContext = useAppContext()
  const cartContext = useCartContext()
  const maxNumberOfVisibleProducts = 10

  const onClose = () => {
    appContext.setSideShoppingListVisible(false)
  }

  return (
    <SideMenu
      title='Koszyk'
      isRight
      onClose={onClose}
      visible={appContext.sideShoppingListVisible}
      containerClassName='w-[85%] sm:w-[490px]'>
      {cartContext.numberOfProducts > 0 ? (
        <ul>
          {cartContext.numberOfUniqueProducts > 0 &&
            cartContext.products
              .slice(0, maxNumberOfVisibleProducts)
              .map(({ id, title, price, quantity, thumbnailUrl }) => (
                <ProductItem key={id}>
                  <ThumbnailWrapper>
                    {thumbnailUrl && (
                      <Image
                        width={40}
                        height={40}
                        layout='responsive'
                        src={thumbnailUrl}
                        alt={title}
                      />
                    )}
                  </ThumbnailWrapper>
                  <ProductNameText
                    onClick={() => {
                      router.push(`/product/${id}`)
                      appContext.setSideShoppingListVisible(false)
                    }}>
                    {title}
                  </ProductNameText>
                  <PriceText>
                    {price && price.toFixed(2).replace('.', ',')}
                  </PriceText>
                  <QuantityTrashContainer>
                    <ProductText>x{quantity}</ProductText>
                    <TrashIcon onClick={() => cartContext.removeFromCart(id)} />
                  </QuantityTrashContainer>
                </ProductItem>
              ))}
          {cartContext.numberOfUniqueProducts > maxNumberOfVisibleProducts && (
            <Item key='more'>
              <PrimaryColorText>{`+${
                cartContext.numberOfUniqueProducts - maxNumberOfVisibleProducts
              } więcej`}</PrimaryColorText>
            </Item>
          )}
          {appContext.sideShoppingListVisible && (
            <AdditionalItem key='cart'>
              <Button
                className='p-2'
                isDisabled={false}
                onClick={() => {
                  router.push(`/cart`)
                  appContext.setSideShoppingListVisible(false)
                }}>
                <SmallText>PRZEJDŹ DO KOSZYKA</SmallText>
              </Button>
            </AdditionalItem>
          )}
        </ul>
      ) : (
        <EmptyCartText>Twój koszyk jest pusty</EmptyCartText>
      )}
    </SideMenu>
  )
}

const Item = tw.li`
  flex
  flex-row
  items-center
  justify-between
  p-1
  space-x-5
`

const QuantityTrashContainer = tw.div`
  flex
  flex-row
  items-center
  p-2
  space-x-2
`

const SmallText = tw.span`
  text-sm
`

const PrimaryColorText = tw.span`
  text-primary-color
`

const ProductText = tw.span`
  text-sm
  text-primary-color
`

const TrashIcon = tw(IoTrashOutline)`
  cursor-pointer
  text-primary-color
`

const AdditionalItem = tw.li`
  fixed
  bottom-0
  right-0
  flex
  flex-row
  items-center
  justify-between
  w-[70%]
  p-3
  mt-5
  
  sm:p-1
  sm:static
  sm:w-full
`

const EmptyCartText = tw.span`
  flex
  justify-center
  text-xl
`

const ProductItem = tw.li`
  flex
  flex-row
  items-center
  justify-start
  w-full
  py-2
  px-2
  space-x-2
  border-t
  border-gray-200

  first:border-t-0
`

const ThumbnailWrapper = tw.div`
  grid
  w-12
`

const ProductNameText = tw.span`
  text-sm
  text-gray-700
  justify-self-end
  w-full
  px-2
  cursor-pointer
`

const PriceText = tw.span`
 	font-semibold
 	text-secondary-color
 	whitespace-nowrap
`

export default SideShoppingList
