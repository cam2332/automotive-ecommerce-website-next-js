import tw from 'tailwind-styled-components'
import ProductCard from './ProductCard'
import ProductCardGrid from './ProductCardGrid'
import { IProduct } from '../DAO/documents/Product'

function ProductList({
  products,
  viewType,
}: {
  products: IProduct[]
  viewType: string
}) {
  return (
    <>
      {viewType === 'list' && (
        <ProductListContainer>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              thumbnailUrl={product.thumbnailUrl}
              title={product.title}
              subTitle={product.subTitle}
              identifier={product.identifier}
              price={product.price}
              currency={product.currency}
              oldPrice={product.oldPrice}
              quantity={product.quantity}
              inWishList={product.inWishList}
              properties={product.properties}
              maxNumberOfPropertiesVisible={3}
              onToggleInWishList={() => {
                /** */
              }}
              onAddToCart={() => {
                /** */
              }}
              onClickTitle={() => {
                /** */
              }}
            />
          ))}
        </ProductListContainer>
      )}
      {viewType === 'grid' && (
        <ProductGridContainer>
          {products.map((product) => (
            <ProductCardGrid
              key={product.id}
              thumbnailUrl={product.thumbnailUrl}
              title={product.title}
              manufacturer={product.manufacturer}
              price={product.price}
              currency={product.currency}
              oldPrice={product.oldPrice}
              inWishList={product.inWishList}
              quantity={product.quantity}
              onToggleInWishList={() => {
                /** */
              }}
              onAddToCart={() => {
                /** */
              }}
              onClickTitle={() => {
                /** */
              }}
            />
          ))}
        </ProductGridContainer>
      )}
    </>
  )
}

const ProductListContainer = tw.div`
  flex
  flex-col
  w-full
`

const ProductGridContainer = tw.div`
  grid
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-2
  lg:max-w-5xl
`

export default ProductList
