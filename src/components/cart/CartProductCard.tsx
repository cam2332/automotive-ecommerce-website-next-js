import Image from 'next/image'
import Link from 'next/link'
import { IoCloseSharp, IoTrashOutline } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import QuantitySelect from '../select/QuantitySelect'
import CartProduct from '../../DAO/types/CartProduct'

interface ICartProductCardProps {
  product: CartProduct
  onClickTitle: () => void
  onClickSetAmount: (amount: number) => void
  onClickRemove: () => void
}

function CartProductCard({
  product,
  onClickTitle,
  onClickSetAmount,
  onClickRemove,
}: ICartProductCardProps) {
  return (
    <Container>
      <Link key={product.id} href={`/product/${product.id}`} passHref>
        <ThumbnailWrapper>
          {product.thumbnailUrl && (
            <Image
              width={100}
              height={100}
              layout='fixed'
              src={product.thumbnailUrl}
              alt={product.title}
            />
          )}
        </ThumbnailWrapper>
      </Link>
      <Info>
        <Link key={product.id} href={`/product/${product.id}`} passHref>
          <Details>
            <Manufacturer>{product.manufacturer}</Manufacturer>
            <Title onClick={onClickTitle}>{product.title}</Title>
            <ArticleId>{product.identifier}</ArticleId>
          </Details>
        </Link>

        <Summary>
          <Price>
            {product.price &&
              (product.price * product.selectedAmount)
                .toFixed(2)
                .replace('.', ',')}{' '}
            {product.currency}
          </Price>
          <PricePerItem>
            {`(${product.selectedAmount} x 
            ${product.price && product.price.toFixed(2).replace('.', ',')}
            ${product.currency})`}
          </PricePerItem>
          <Actions>
            <Delete>
              <TrashIcon onClick={() => onClickRemove()} />
            </Delete>
            <QuantitySelect
              selectedValue={product.selectedAmount}
              numberOfOptions={product.quantity}
              onClickItem={(amount: number) => onClickSetAmount(amount)}
              disabled={product.quantity <= 0}
            />
          </Actions>
        </Summary>
      </Info>
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-row
  py-5
  border-t
  
  md:p-6
`

const ThumbnailWrapper = tw.a`
  h-[102px]
  w-[102px]
  border
  mr-2
`

const Info = tw.div`
  flex
  flex-1
  flex-row
  justify-between
`

const Details = tw.a`
  flex
  flex-col
  text-primary-color
  font-semibold
  min-w-[50%]
  cursor-pointer
`

const Title = tw.span`
  cursor-pointer
`

const Manufacturer = tw.span`
  text-gray-500
  font-normal
`

const ArticleId = tw.span``

const Summary = tw.div`
  flex
 	flex-col
 	items-end
  w-2/3
`

const Price = tw.span`
text-primary-color
 	font-semibold
 	whitespace-nowrap
`

const PricePerItem = tw.span`
  text-gray-400
`

const Actions = tw.div`
  flex
 	flex-row
 	items-center
 	justify-en
 	my-1
`

const Delete = tw.div`
  flex
  items-center
  justify-center
  mr-2
  bg-white
  border-2
  border-gray-200
  rounded-2xl
  py-2px
  min-h-8
  min-w-70px
  cursor-pointer
`

const TrashIcon = tw(IoTrashOutline)`
  flex
  text-lg
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
