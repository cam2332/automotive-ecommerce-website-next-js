import { useState } from 'react'
import Image from 'next/image'
import {
  IoCartSharp,
  IoCheckmarkSharp,
  IoHeartOutline,
  IoHeart,
  IoCloseSharp,
} from 'react-icons/io5'
import { GoPrimitiveDot } from 'react-icons/go'
import tw from 'tailwind-styled-components'
import QuantitySelect from './select/QuantitySelect'

function ProductCard({
  thumbnailUrl,
  title,
  subTitle,
  identifier,
  price,
  oldPrice,
  discountPercent,
  currency,
  quantity,
  inWishList,
  properties,
  maxNumberOfPropertiesVisible,
  onToggleInWishList,
  onAddToCart,
  onClickTitle,
}: {
  thumbnailUrl: string
  title: string
  subTitle: string
  identifier: string
  price: number
  oldPrice?: number
  discountPercent?: number
  currency: string
  quantity: number
  inWishList: boolean
  properties?: {
    name: string
    unit?: string
    value: number | string
  }[]
  maxNumberOfPropertiesVisible: number
  onToggleInWishList: () => void
  onAddToCart: (amount: number) => void
  onClickTitle: () => void
}) {
  const [amount, setAmount] = useState<number>(1)

  return (
    <Container>
      <ThumbnailWrapper>
        {thumbnailUrl && (
          <Image
            width={100}
            height={100}
            layout='responsive'
            src={thumbnailUrl}
            alt={title}
          />
        )}
      </ThumbnailWrapper>

      <MainContainer>
        <DescriptionContainer>
          <TitleText onClick={onClickTitle}>{title}</TitleText>
          <SubTitleText>{subTitle}</SubTitleText>
          <ArticleId>Nr artykułu: {identifier}</ArticleId>
          <PropertiesWrapper>
            <PropertiesList>
              {properties &&
                properties
                  .slice(0, maxNumberOfPropertiesVisible)
                  .map(({ name, unit, value }, index) => (
                    <PropertyItem key={index}>
                      <DotIcon />
                      <PropertyContainer>
                        <PropertyNameText>
                          {name}
                          {unit && ` [${unit}]`}:
                        </PropertyNameText>
                        <PropertyValueText>{value}</PropertyValueText>
                      </PropertyContainer>
                    </PropertyItem>
                  ))}
              {properties &&
                properties.length > 2 &&
                maxNumberOfPropertiesVisible < properties.length && (
                  <span>...</span>
                )}
            </PropertiesList>
          </PropertiesWrapper>
        </DescriptionContainer>

        <DetailsContainer>
          {oldPrice && (
            <DiscountPercentageText>
              {discountPercent ||
                Math.round(((price - oldPrice) / oldPrice) * 100)}
              %
            </DiscountPercentageText>
          )}

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

          <AvailabilityContainer>
            {quantity > 0 ? (
              <>
                <QuantitySelect
                  selectedValue={amount}
                  numberOfOptions={quantity}
                  onClickItem={(amount: number) => setAmount(amount)}
                />
                <CheckmarkIcon />
                <AvailableText>Na stanie</AvailableText>
              </>
            ) : (
              <>
                <CloseIcon />
                <NotAvailableText>Niedostępny</NotAvailableText>
              </>
            )}
          </AvailabilityContainer>

          <CartWishListContainer>
            <AddToCartButton
              onClick={() => onAddToCart(amount)}
              disabled={quantity === 0}
              $quantity={quantity}>
              <CartIcon />
              <AddToCartText>Dodaj do koszyka</AddToCartText>
            </AddToCartButton>

            {inWishList ? (
              <BigHeartFillIcon onClick={onToggleInWishList} />
            ) : (
              <BigHeartOutlineIcon onClick={onToggleInWishList} />
            )}
          </CartWishListContainer>
        </DetailsContainer>
      </MainContainer>
      {inWishList ? (
        <SmallHeartFillIcon onClick={onToggleInWishList} />
      ) : (
        <SmallHeartOutlineIcon onClick={onToggleInWishList} />
      )}
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-row
  items-start
  justify-between
  p-4
  
  md:p-6
`

const ThumbnailWrapper = tw.div`
  grid
  w-56
  p-3
  
  lg:w-60
`

const MainContainer = tw.div`
  flex
  flex-col
  justify-between
  w-full
  
  md:flex-row
`

const DescriptionContainer = tw.div`
  flex
  flex-col
`

const TitleText = tw.span`
  mr-5
  font-medium
  cursor-pointer
  text-primary-color
`

const SubTitleText = tw.span`
  py-1
  text-sm
  text-primary-color
`

const ArticleId = tw.span`
  text-sm
 	text-gray-500
`

const PropertiesWrapper = tw.div`
  flex-col
 	hidden
 	py-3

 	md:flex
`

const PropertiesList = tw.ul`
  space-y-2
 	list-disc
`

const PropertyItem = tw.li`
  flex
  flex-row
  items-center
  space-x-2
`

const DotIcon = tw(GoPrimitiveDot)`
  text-sm
  text-gray-500
`

const PropertyContainer = tw.div`
  flex
  flex-row
  space-x-3
`

const PropertyNameText = tw.span`
  text-sm
  font-semibold
  text-gray-500
`

const PropertyValueText = tw.span`
  text-sm
  font-semibold
  text-gray-500
`

const DetailsContainer = tw.div`
  flex
 	flex-col
 	items-end

 	md:justify-start
`

const DiscountPercentageText = tw.span`
  py-3
  font-bold
  whitespace-nowrap
  text-secondary-color
  
  lg:self-end
  lg:text-2xl
`

const PricesContainer = tw.div`
  flex
 	flex-row
 	items-center
 	space-x-3

 	lg:space-x-6
`

const PriceText = tw.span`
  text-2xl
 	font-semibold
 	whitespace-nowrap
`

const OldPriceText = tw.span`
  text-lg
  text-gray-500
  line-through
  whitespace-nowrap
`

const AvailabilityContainer = tw.div`
  flex
 	flex-row
 	items-center
 	justify-end
 	my-1
`

const CheckmarkIcon = tw(IoCheckmarkSharp)`
  m-3
  scale-200
  text-xl
  text-green-600
`

const AvailableText = tw.span`
  text-sm
  font-semibold
  text-green-600
  whitespace-nowrap
`

const CloseIcon = tw(IoCloseSharp)`
  m-3
  text-xl
  text-red-600
`

const NotAvailableText = tw.span`
  text-sm
  font-semibold
  text-red-600
  whitespace-nowrap
`

const CartWishListContainer = tw.div`
  flex
 	flex-row
 	items-center
 	space-x-3
`

const AddToCartButton = tw.button`
  flex
  flex-row
  items-center
  justify-center
  w-1/2
  min-w-225px
  py-2px
  my-3
  space-x-2
  border-2
  rounded-full
  font-semibold
  text-body-color
  ${({ $quantity }: { $quantity: number }) =>
    $quantity > 0
      ? 'border-secondary-color bg-secondary-color cursor-pointer'
      : 'border-gray-500 bg-gray-500 cursor-default'}
  
  lg:w-full
  `

const CartIcon = tw(IoCartSharp)`
  text-4xl
 	text-body-color

 	lg:text-3xl
`

const AddToCartText = tw.span`
  hidden
 	text-sm
 	uppercase
 	whitespace-nowrap

 	md:flex
`

const BigHeartFillIcon = tw(IoHeart)`
  hidden
  text-3xl
  cursor-pointer
  text-primary-color

  md:flex
`

const BigHeartOutlineIcon = tw(IoHeartOutline)`
  hidden
  text-3xl
  cursor-pointer
  text-primary-color

  md:flex
`

const SmallHeartFillIcon = tw(IoHeart)`
  -ml-5
  text-3xl
  cursor-pointer
  text-primary-color
  
  md:hidden
`

const SmallHeartOutlineIcon = tw(IoHeartOutline)`
  -ml-5
  text-3xl
  cursor-pointer
  text-primary-color
  
  md:hidden
`

export default ProductCard
