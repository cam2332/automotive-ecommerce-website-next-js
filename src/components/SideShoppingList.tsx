import { useRouter } from 'next/router'
import { IoTrashOutline } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import SideMenu from './SideMenu'
import { useCartContext } from '../context/CartContext'
import Button from './Button'

function SideShoppingList({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const router = useRouter()
  const cartContext = useCartContext()
  const maxNumberOfVisibleProducts = 10

  return (
    <SideMenu title={'Koszyk'} isRight onClose={onClose} visible={visible}>
      {cartContext.numberOfProducts > 0 ? (
        <ul>
          {cartContext.numberOfUniqueProducts > 0 &&
            cartContext.products
              .slice(0, maxNumberOfVisibleProducts)
              .map((product) => (
                <Item key={product.id}>
                  <ProductText
                    onClick={() => {
                      router.push(`/product/${product.id}`)
                    }}>
                    {product.title}
                  </ProductText>
                  <QuantityTrashContainer>
                    <ProductText>x{product.quantity}</ProductText>
                    <TrashIcon
                      onClick={() => cartContext.removeFromCart(product.id)}
                    />
                  </QuantityTrashContainer>
                </Item>
              ))}
          {cartContext.numberOfUniqueProducts > maxNumberOfVisibleProducts && (
            <Item key={'more'}>
              <PrimaryColorText>{`+${
                cartContext.numberOfUniqueProducts - maxNumberOfVisibleProducts
              } więcej`}</PrimaryColorText>
            </Item>
          )}
          {visible && (
            <AdditionalItem key={'cart'}>
              <Button
                className='p-2'
                isDisabled={false}
                onClick={() => router.push(`/cart`)}>
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

export default SideShoppingList
