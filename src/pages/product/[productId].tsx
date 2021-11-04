import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import tw from 'tailwind-styled-components'
import {
  IoHeart,
  IoHeartOutline,
  IoCartSharp,
  IoStarOutline,
  IoStarSharp,
} from 'react-icons/io5'
import { findProductById } from '../../business/ProductManager'
import SiteWrapper from '../../components/SiteWrapper'
import { IProduct } from '../../DAO/documents/Product'
import dbConnect from '../../utils/dbConnect'
import QuantitySelect from '../../components/select/QuantitySelect'
import { useCartContext } from '../../context/CartContext'
import { useWishListContext } from '../../context/WishListContext'
import { authorize } from '../../business/SessionManager'

function index(props: IProduct & { compatibleCars: ICarMake[] }) {
  const cartContext = useCartContext()
  const wishListContext = useWishListContext()
  const [localProduct, setLocalProduct] = useState({ ...props })
  const [amount, setAmount] = useState<number>(1)
  const addToCart = () => {
    cartContext.addToCart(props, amount)
  }
  const toggleInWishList = () => {
    wishListContext.isInWishList(localProduct.id)
      ? wishListContext.removeFromWishList(localProduct.id).then((success) => {
          setLocalProduct((product) => {
            product.inWishList = false
            return product
          })
        })
      : wishListContext.addToWishList(localProduct).then((success) => {
          setLocalProduct((product) => {
            product.inWishList = true
            return product
          })
        })
  }

  return (
    <SiteWrapper title={props.title}>
      <Overview>
        <BigThumbnailWrapper>
          <ThumbnailWrapper>
            {props.thumbnailUrl && (
              <Image
                width={200}
                height={200}
                layout='responsive'
                src={props.thumbnailUrl}
              />
            )}
          </ThumbnailWrapper>
        </BigThumbnailWrapper>
        <Container>
          <TitleWrapper>
            <Title>
              <TitleText>{props.title}</TitleText>
              <SubTitleText>{props.subTitle}</SubTitleText>
            </Title>
            {wishListContext.isInWishList(localProduct.id) ? (
              <HeartFillIcon onClick={toggleInWishList} />
            ) : (
              <HeartOutlineIcon onClick={toggleInWishList} />
            )}
          </TitleWrapper>
          <SmallThumbnailWrapper>
            <ThumbnailWrapper>
              {props.thumbnailUrl && (
                <Image
                  width={200}
                  height={200}
                  layout='responsive'
                  src={props.thumbnailUrl}
                />
              )}
            </ThumbnailWrapper>
          </SmallThumbnailWrapper>
          <PricesContainer>
            <Prices>
              <PriceText>
                {props.price &&
                  (props.price * amount).toFixed(2).replace('.', ',')}{' '}
                {props.currency}
              </PriceText>
              {props.oldPrice && (
                <OldPriceText>
                  {(props.oldPrice * amount).toFixed(2).replace('.', ',')}
                  {props.currency}
                </OldPriceText>
              )}
            </Prices>
            <ApiecePriceText>
              Cena za sztukę:
              {props.price && props.price.toFixed(2).replace('.', ',')}
              {props.currency}
            </ApiecePriceText>
          </PricesContainer>
          <AvailabilityContainer>
            {props.quantity > 0 && (
              <QuantityWrapper>
                <QuantitySelect
                  selectedValue={amount}
                  numberOfOptions={props.quantity}
                  onClickItem={(amount: number) => setAmount(amount)}
                />
              </QuantityWrapper>
            )}
            <AddToCartButton
              onClick={addToCart}
              disabled={props.quantity < 0}
              $quantity={props.quantity}>
              <CartIcon />
              <AddToCartText>Dodaj do koszyka</AddToCartText>
            </AddToCartButton>
          </AvailabilityContainer>
        </Container>
      </Overview>
      <DescriptionContainer>
        <SectionWrapper>
          <SectionTitle>Szczegóły produktu</SectionTitle>
          <PropertiesWrapper>
            <PropertiesList>
              <PropertyItem key={props.identifier}>
                <PropertyContainer>
                  <PropertyNameText>Kod produktu:</PropertyNameText>
                  <PropertyValueText>{props.identifier}</PropertyValueText>
                </PropertyContainer>
              </PropertyItem>
              {props.properties &&
                props.properties
                  .slice(0, Math.floor(props.properties.length / 2))
                  .map(({ name, unit, value }, index) => (
                    <PropertyItem key={index}>
                      <PropertyContainer>
                        <PropertyNameText>
                          {name}
                          {unit && ` [${unit}]`}:
                        </PropertyNameText>
                        <PropertyValueText>{value}</PropertyValueText>
                      </PropertyContainer>
                    </PropertyItem>
                  ))}
            </PropertiesList>
            <PropertiesList>
              {props.properties &&
                props.properties
                  .slice(Math.floor(props.properties.length / 2))
                  .map(({ name, unit, value }, index) => (
                    <PropertyItem key={index}>
                      <PropertyContainer>
                        <PropertyNameText>
                          {name}
                          {unit && ` [${unit}]`}:
                        </PropertyNameText>
                        <PropertyValueText>{value}</PropertyValueText>
                      </PropertyContainer>
                    </PropertyItem>
                  ))}
            </PropertiesList>
          </PropertiesWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <SectionTitle>Pasuje do auta</SectionTitle>
          {compatibleCarTypeIds.map((id) => (
            <span key={id}>{id}</span>
          ))}
        </SectionWrapper>
      </DescriptionContainer>
    </SiteWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productId = context.query.productId as string
  let product: IProduct = null

  try {
    await dbConnect()

    if (resultProduct.isRight()) {
      product = resultProduct.value
    }
  } catch (error) {
    console.log('e', error)
  }

  return {
    props: { ...product },
  }
}

const Overview = tw.div`
  flex
  flex-row
  justify-center
  w-full
  h-full
  p-3

  md:p-5
`

const BigThumbnailWrapper = tw.div`
  hidden
  w-5/12
  
  md:flex
`

const TitleWrapper = tw.div`
  flex
  flex-row
  flex-grow
  w-full
`

const Title = tw.div`
  flex
  flex-col
  items-start
  
  w-full
`

const SmallThumbnailWrapper = tw.div`
  flex
  flex-row
  justify-center
  w-full
  h-full
  
  md:hidden
`

const Container = tw.div`
  flex
  flex-col
  items-center
  justify-between
  w-full
  
  md:p-3
  md:w-7/12
`

const PropertiesWrapper = tw.div`
  grid
  
  lg:grid-cols-2
`

const HeartFillIcon = tw(IoHeart)`
  flex
 	self-start
 	text-3xl
 	cursor-pointer
 	text-primary-color
`

const HeartOutlineIcon = tw(IoHeartOutline)`
  flex
 	self-start
 	text-3xl
 	cursor-pointer
 	text-primary-color
`

const TitleText = tw.span`
  font-medium
  text-primary-color
  text-lg
`

const SubTitleText = tw.span`
  py-1
  text-sm
  text-primary-color
`

const ThumbnailWrapper = tw.div`
  grid
  w-5/6
  p-3

  md:w-96
`

const PricesContainer = tw.div`
  flex
 	flex-col
  justify-start
  w-full
  my-3
`

const Prices = tw.div`
  flex
  flex-row
  items-center
  space-x-5
`

const AvailabilityContainer = tw.div`
  flex
  flex-row
  items-center
  w-full
  space-x-4
`

const QuantityWrapper = tw.div`
  max-w-none
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

const PriceText = tw.span`
  text-3xl
 	font-semibold
 	text-secondary-color
 	whitespace-nowrap
`

const OldPriceText = tw.span`
  text-2xl
  text-gray-500
  line-through
  whitespace-nowrap
`

const ApiecePriceText = tw.span`
  text-gray-500
  whitespace-nowrap
`

const DescriptionContainer = tw.div`
  flex
  flex-col
  w-full
  p-3

  md:p-5
`

const SectionWrapper = tw.div`
  flex
 	flex-col
 	py-3
`

const SectionTitle = tw.span`
  mx-2
  my-3
  font-semibold
  text-primary-color
`

const PropertiesList = tw.ul`
 	list-disc
`

const PropertyItem = tw.li`
  flex
  flex-row
  items-center
  py-2
  px-2
  space-x-2
  border-t
  border-gray-200
`

const PropertyContainer = tw.div`
  flex
  flex-row
  space-x-3
`

const PropertyNameText = tw.span`
  text-sm
  font-semibold
  text-gray-700
`

const PropertyValueText = tw.span`
  text-sm
  text-normal
  text-gray-700
`

export default index
