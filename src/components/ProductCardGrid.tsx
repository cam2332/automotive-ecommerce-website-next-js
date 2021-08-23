import Image from 'next/image'
import tw from 'tailwind-styled-components'
import { IoHeart, IoHeartOutline, IoCartSharp } from 'react-icons/io5'

function ProductCardGrid({
  thumbnailUrl,
  manufacturer,
  title,
  price,
  oldPrice,
  currency,
  quantity,
  inWishList,
  onToggleInWishList,
  onAddToCart,
  onClickTitle,
}: {
  thumbnailUrl: string
  manufacturer: string
  title: string
  price: number
  oldPrice?: number
  currency: string
  quantity: number
  inWishList: boolean
  onToggleInWishList: () => void
  onAddToCart: () => void
  onClickTitle: () => void
}) {
  return (
    <Container>
      {inWishList ? (
        <HeartFillIcon onClick={onToggleInWishList} />
      ) : (
        <HeartOutlineIcon onClick={onToggleInWishList} />
      )}
      <ThumbnailWrapper onClick={onClickTitle}>
        {thumbnailUrl && (
          <Image
            width={200}
            height={200}
            layout='responsive'
            src={thumbnailUrl}
          />
        )}
      </ThumbnailWrapper>
      <DetailsContainer>
        <MaunfacturerText>{manufacturer}</MaunfacturerText>
        <TitleText onClick={onClickTitle}>{title}</TitleText>
        <PricesContainer>
          <PriceText>
            {price && price.toFixed(2).replace('.', ',')} {currency}
          </PriceText>
          {oldPrice && (
            <OldPriceText>
              {oldPrice.toFixed(2).replace('.', ',')} {currency}
            </OldPriceText>
          )}
        </PricesContainer>
        <AddToCartButton
          onClick={onAddToCart}
          disabled={quantity < 0}
          $quantity={quantity}>
          <CartIcon />
          <AddToCartText>Dodaj do koszyka</AddToCartText>
        </AddToCartButton>
      </DetailsContainer>
    </Container>
  )
}

const Container = tw.div`
  flex
 	flex-col
 	items-center
 	justify-between
 	p-4
 	md:p-6
`

const HeartFillIcon = tw(IoHeart)`
  flex
 	self-end
 	mr-2
 	text-3xl
 	cursor-pointer
 	text-primary-color
`

const HeartOutlineIcon = tw(IoHeartOutline)`
  flex
 	self-end
 	mr-2
 	text-3xl
 	cursor-pointer
 	text-primary-color
`

const ThumbnailWrapper = tw.div`
  grid
 	w-full
 	p-2
`

const DetailsContainer = tw.div`
  flex
 	flex-col
 	items-center
 	w-full
`

const MaunfacturerText = tw.span`
  font-medium
 	text-center
 	text-primary-color
`

const TitleText = tw.span`
  text-center
 	text-primary-color
`

const PricesContainer = tw.div`
  flex
 	flex-row
 	items-center
 	space-x-3

 	lg:space-x-6
`

const PriceText = tw.span`
  text-lg
 	font-semibold
 	text-secondary-color
 	whitespace-nowrap
`

const OldPriceText = tw.span`
  text-base
  text-gray-500
  line-through
  whitespace-nowrap
`

const AddToCartButton = tw.button`
  flex
 	flex-row
 	items-center
 	justify-center
 	w-full
 	my-3
  py-2px
 	space-x-3
 	font-semibold
 	border-2
 	rounded-full
   text-body-color
  ${({ $quantity }: { $quantity: number }) =>
    $quantity > 0
      ? 'border-secondary-color bg-secondary-color cursor-pointer'
      : 'border-gray-500 bg-gray-500 cursor-default'}
`

const CartIcon = tw(IoCartSharp)`
  text-2xl
 	text-body-color
 	lg:text-3xl
`

const AddToCartText = tw.span`
  flex
 	text-sm
 	uppercase
`

export default ProductCardGrid
