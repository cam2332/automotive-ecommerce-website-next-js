import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import { useAppContext } from '../context/AppContext'
import { useWishListContext } from '../context/WishListContext'
import Button from './Button'
import SideMenu from './SideMenu'

function SideWishList() {
  const router = useRouter()
  const appContext = useAppContext()
  const wishListContext = useWishListContext()
  const maxNumberOfVisibleProducts = 10

  const onClose = () => {
    appContext.setSideWishListVisible(false)
  }

  return (
    <SideMenu
      title='Lista życzeń'
      isRight
      onClose={onClose}
      visible={appContext.sideWishListVisible}
      containerClassName='w-[85%] sm:w-[490px]'>
      {wishListContext.numberOfProducts > 0 ? (
        <ul>
          {wishListContext.products
            .slice(0, maxNumberOfVisibleProducts)
            .map(({ id, title, price, thumbnailUrl }) => (
              <ProductItem
                key={id}
                onClick={() => {
                  router.push(`/product/${id}`)
                  appContext.setSideWishListVisible(false)
                }}>
                <ThumbnailWrapper>
                  {thumbnailUrl && (
                    <Image
                      width={40}
                      height={40}
                      layout='responsive'
                      src={thumbnailUrl}
                    />
                  )}
                </ThumbnailWrapper>
                <ProductNameText>{title}</ProductNameText>
                <PriceText>
                  {price && price.toFixed(2).replace('.', ',')}
                </PriceText>
                <TrashContainer>
                  <TrashIcon
                    onClick={() => wishListContext.removeFromWishList(id)}
                  />
                </TrashContainer>
              </ProductItem>
            ))}
          {wishListContext.numberOfProducts > maxNumberOfVisibleProducts && (
            <Item key='more'>
              <PrimaryColorText>
                {`+${
                  wishListContext.numberOfProducts - maxNumberOfVisibleProducts
                } więcej`}
              </PrimaryColorText>
            </Item>
          )}
          {appContext.sideWishListVisible && (
            <AdditionalItem key='wishlist'>
              <Button
                className='p-2'
                isDisabled={false}
                onClick={() => {
                  router.push(`/wishlist`)
                  appContext.setSideWishListVisible(false)
                }}>
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

export default SideWishList
