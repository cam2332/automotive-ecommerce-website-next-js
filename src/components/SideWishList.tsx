import { useRouter } from 'next/router'
import React from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import { useWishListContext } from '../context/WishListContext'
import Button from './Button'
import SideMenu from './SideMenu'

function SideWishList({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const router = useRouter()
  const wishListContext = useWishListContext()
  const maxNumberOfVisibleProducts = 10

  return (
    <SideMenu
      title={'Lista życzeń'}
      isRight={true}
      onClose={onClose}
      visible={visible}>
      {wishListContext.numberOfProducts > 0 ? (
        <ul>
          {wishListContext.products
            .slice(0, maxNumberOfVisibleProducts)
            .map((product) => (
              <Item key={product.id}>
                <ProductText
                  onClick={() => router.push(`/products/${product.id}`)}>
                  {product.title}
                </ProductText>
                <TrashContainer>
                  <TrashIcon
                    onClick={() =>
                      wishListContext.removeFromWishList(product.id)
                    }
                  />
                </TrashContainer>
              </Item>
            ))}
          {wishListContext.numberOfProducts > maxNumberOfVisibleProducts && (
            <Item key={'more'}>
              <PrimaryColorText>
                {`+${(wishListContext.numberOfProducts =
                  maxNumberOfVisibleProducts)} więcej`}
              </PrimaryColorText>
            </Item>
          )}
          {visible && (
            <AdditionalItem key={'wishlist'}>
              <Button
                className='p-2'
                isDisabled={false}
                onClick={() => router.push(`/wishlist`)}>
                <SmallText>PRZEJDŹ DO LISTY ŻYCZEŃ</SmallText>
              </Button>
            </AdditionalItem>
          )}
        </ul>
      ) : (
        <EmptyWishListText>Twoja lista życzeń jest pusta</EmptyWishListText>
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

const ProductText = tw.span`
  text-sm
  text-primary-color
`

const TrashContainer = tw.div`
  flex
  flex-row
  items-center
  p-2
  space-x-2
`

const TrashIcon = tw(IoTrashOutline)`
  cursor-pointer
  text-primary-color
`

const PrimaryColorText = tw.span`
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

const SmallText = tw.span`
  text-sm
`

const EmptyWishListText = tw.span`
  flex
  justify-center
  text-xl
`

export default SideWishList
