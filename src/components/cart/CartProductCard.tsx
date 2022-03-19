import Image from 'next/image'
import { IoCheckmarkSharp, IoCloseSharp, IoTrashOutline } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import QuantitySelect from '../select/QuantitySelect'
import { IProduct } from '../../DAO/documents/Product'

interface ICartProductCardProps {
  product: IProduct
  selectedAmount: number
  onClickTitle: () => void
  onClickSetAmount: (amount: number) => void
  onClickRemove: () => void
}

function CartProductCard({
  product,
  selectedAmount,
  onClickTitle,
  onClickSetAmount,
  onClickRemove,
}: ICartProductCardProps) {
  return (
    <Container>
      <ThumbnailWrapper>
        {product.thumbnailUrl && (
          <Image
            width={100}
            height={100}
            layout='responsive'
            src={product.thumbnailUrl}
            alt={product.title}
          />
        )}
      </ThumbnailWrapper>

      <MainContainer>
        <DescriptionContainer>
          <TitleMobileTrash>
            <TitleText onClick={onClickTitle}>{product.title}</TitleText>
            <TrashIcon
              className='flex md:hidden'
              onClick={() => onClickRemove()}
            />
          </TitleMobileTrash>
          <SubTitleText>{product.subTitle}</SubTitleText>
          <ArticleId>Nr artykułu: {product.identifier}</ArticleId>
        </DescriptionContainer>

        <DetailsContainer>
          <AvailabilityContainer>
            {product.quantity > 0 ? (
              <>
                <QuantitySelect
                  selectedValue={selectedAmount}
                  numberOfOptions={product.quantity}
                  onClickItem={(amount: number) => onClickSetAmount(amount)}
                />
              </>
            ) : (
              <>
                <CloseIcon />
                <NotAvailableText>Niedostępny</NotAvailableText>
              </>
            )}
          </AvailabilityContainer>
          <PricesContainer>
            {product.oldPrice && (
              <OldPriceText>
                {(product.oldPrice * selectedAmount)
                  .toFixed(2)
                  .replace('.', ',')}{' '}
                {product.currency}
              </OldPriceText>
            )}
            <PriceText>
              {product.price &&
                (product.price * selectedAmount)
                  .toFixed(2)
                  .replace('.', ',')}{' '}
              {product.currency}
            </PriceText>
          </PricesContainer>
          <TrashIcon
            className='hidden md:flex'
            onClick={() => onClickRemove()}
          />
        </DetailsContainer>
      </MainContainer>
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-row
  items-start
  justify-between
  p-4
  w-full
  
  md:p-6
`

const ThumbnailWrapper = tw.div`
  grid
  w-32
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
  w-full
`

const TitleMobileTrash = tw.div`
  flex 
  flex-row 
  items-center 
  justify-between
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

const DetailsContainer = tw.div`
  flex
 	flex-row
 	items-center
  justify-between
  my-4
  w-2/3
`

const PricesContainer = tw.div`
  flex
 	flex-col
 	items-start
`

const PriceText = tw.span`
  text-xl
 	font-semibold
 	whitespace-nowrap
  mx-3
  lg:mx-6
`

const OldPriceText = tw.span`
  text-base
  text-gray-500
  line-through
  whitespace-nowrap
  mx-3
  lg:mx-6
`

const AvailabilityContainer = tw.div`
  flex
 	flex-row
 	items-center
 	justify-en
 	my-1
`

const CheckmarkIcon = tw(IoCheckmarkSharp)`
  m-3
  scale-200
  text-xl
  text-green-600
`

const TrashIcon = tw(IoTrashOutline)`
  text-xl
  cursor-pointer
  text-primary-color
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

export default CartProductCard
