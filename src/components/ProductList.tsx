import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import ProductCard from './ProductCard'
import ProductCardGrid from './ProductCardGrid'
import { IProduct } from '../DAO/documents/Product'
import { useCartContext } from '../context/CartContext'
import { useWishListContext } from '../context/WishListContext'
import { useState } from 'react'

function ProductList({
  products,
  viewType,
}: {
  products: IProduct[]
  viewType: string
}) {
  const router = useRouter()
  const cartContext = useCartContext()
  const wishListContext = useWishListContext()
  const [localProducts, setLocalProducts] = useState(products)

  return (
    <>
      {viewType === 'list' && (
        <ProductListContainer>
          {localProducts.map((product) => (
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
                product.inWishList
                  ? wishListContext
                      .removeFromWishList(product.id)
                      .then((success) => {
                        setLocalProducts((products) => {
                          products.find(
                            (prod) => prod.id === product.id
                          ).inWishList = false
                          return products
                        })
                      })
                  : wishListContext.addToWishList(product).then((success) => {
                      setLocalProducts((products) => {
                        products.find(
                          (prod) => prod.id === product.id
                        ).inWishList = true
                        return products
                      })
                    })
              }}
              onAddToCart={(amount) => {
                cartContext.addToCart(product, amount)
              }}
              onClickTitle={() => {
                router.push('/product/' + product.id)
              }}
            />
          ))}
        </ProductListContainer>
      )}
      {viewType === 'grid' && (
        <ProductGridContainer>
          {localProducts.map((product) => (
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
                product.inWishList
                  ? wishListContext
                      .removeFromWishList(product.id)
                      .then((success) => {
                        setLocalProducts((products) => {
                          products.find(
                            (prod) => prod.id === product.id
                          ).inWishList = false
                          return products
                        })
                      })
                  : wishListContext.addToWishList(product).then((success) => {
                      setLocalProducts((products) => {
                        products.find(
                          (prod) => prod.id === product.id
                        ).inWishList = true
                        return products
                      })
                    })
              }}
              onAddToCart={() => {
                cartContext.addToCart(product, 1)
              }}
              onClickTitle={() => {
                router.push('/product/' + product.id)
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
