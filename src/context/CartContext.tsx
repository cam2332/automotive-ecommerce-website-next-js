import { createContext, useContext, useEffect, useState } from 'react'
import { IProduct } from '../DAO/documents/Product'
import { useSessionContext } from './SessionContext'
import { useToastContext } from './ToastContext'

type CartContextProps = {
  products: IProduct[]
  numberOfProducts: number
  total: number
  addToCart: (product: IProduct, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextProps>(
  {} as CartContextProps
)

const CartProvider: React.FC = ({ children }): React.ReactElement => {
  const sessionContext = useSessionContext()
  const toastContext = useToastContext()
  const [products, setProducts] = useState<IProduct[]>([])

  const saveToLocalStorage = (products: IProduct[]) => {
    localStorage.setItem(
      'cart',
      JSON.stringify(
        products.map((product) => {
          return { id: product.id, quantity: product.quantity }
        })
      )
    )
  }

  useEffect(() => {
    if (sessionContext.user) {
      // TODO: implement call to api
    } else {
      try {
        const localCart: IProduct[] = JSON.parse(localStorage.getItem('cart'))
        if (Array.isArray(localCart)) {
          setProducts(localCart)
          console.log(localCart)
        } else {
          setProducts([])
          console.log('cart is not JSON array')
        }
      } catch (error) {
        setProducts([])
        console.log('error parsing cart JSON')
      }
    }
  }, [])

  const addToCart = async (
    product: IProduct,
    quantity: number
  ): Promise<void> => {
    if (sessionContext.user) {
      // TODO: implement call to api
    } else {
      const index = products.findIndex((prod) => prod.id === product.id)
      if (index !== -1) {
        const newQuantity = products[index].quantity + quantity
        if (newQuantity > product.quantity) {
          toastContext.addToast({
            text: 'W koszyku jest już maksymalna ilość wybranego produktu.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        }
        products[index].quantity = Math.min(newQuantity, product.quantity)
        setProducts((products) => {
          const newProductList = [...products]
          saveToLocalStorage(newProductList)
          return newProductList
        })
      } else {
        setProducts((products) => {
          const newProductList = [
            ...products,
            { ...product, quantity: quantity },
          ]
          saveToLocalStorage(newProductList)
          return newProductList
        })
      }
    }
  }

  const removeFromCart = async (productId: string): Promise<void> => {
    if (sessionContext.user) {
      // TODO: implement call to api
    } else {
      const index = products.findIndex(({ id }) => {
        id === productId
      })
      setProducts((products) => {
        const newProducts = products.filter(({ id }) => id !== productId)
        saveToLocalStorage(newProducts)
        return newProducts
      })
    }
  }

  const clearCart = async () => {
    if (sessionContext.user) {
      // TODO: implement call to api
    } else {
      setProducts([])
      saveToLocalStorage([])
    }
  }

  return (
    <CartContext.Provider
      value={{
        products,
        numberOfProducts: products.reduce(
          (prev, product) => prev + product.quantity,
          0
        ),
        total: products.reduce(
          (prev, product) => prev + product.price * product.quantity,
          0
        ),
        addToCart,
        removeFromCart,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const state = useContext(CartContext)

  if (state === undefined) {
    throw new Error('useCartContext must be used within an CartProvider')
  }

  return state
}

export default CartProvider
