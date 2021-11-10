import { createContext, useContext, useEffect, useState } from 'react'
import { IProduct } from '../DAO/documents/Product'
import { useSessionContext } from './SessionContext'
import { useToastContext } from './ToastContext'
import redaxios from 'redaxios'

type CartContextProps = {
  products: IProduct[]
  numberOfProducts: number
  numberOfUniqueProducts: number
  total: number
  addToCart: (
    product: IProduct,
    quantity: number,
    setAddQuantity?: boolean
  ) => Promise<void>
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
    if (sessionContext.token) {
      redaxios
        .get('/api/cart', {
          headers: { authorization: sessionContext.token },
        })
        .then((response) => {
          if (response.status === 200) {
            setProducts(response.data || [])
          } else {
            setProducts([])
          }
        })
        .catch(function (error) {
          setProducts([])
          toastContext.addToast({
            text: 'Wystąpił błąd podczas pobierania produktów do koszyka.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        })
    } else {
      try {
        const localCart: { id: string; quantity: number }[] = JSON.parse(
          localStorage.getItem('cart')
        )
        if (Array.isArray(localCart) && localCart.length > 0) {
          redaxios
            .get('/api/products', {
              params: {
                ids: localCart.map((product) => product.id),
              },
            })
            .then(function (response) {
              if (response.status === 200) {
                setProducts(response.data.results)
              } else {
                setProducts([])
                saveToLocalStorage([])
              }
            })
            .catch(function (error) {
              setProducts([])
              saveToLocalStorage([])
            })
        } else {
          setProducts([])
          saveToLocalStorage([])
        }
      } catch (error) {
        setProducts([])
        saveToLocalStorage([])
      }
    }
  }, [sessionContext.token])

  const addToCart = async (
    product: IProduct,
    quantity: number,
    setAddQuantity?: boolean
  ): Promise<void> => {
    if (sessionContext.user) {
      redaxios
        .put(
          '/api/cart',
          {
            productId: product.id,
            quantity: quantity,
          },
          {
            params: {
              setAddQuantity: setAddQuantity || false,
            },
            headers: { authorization: sessionContext.token },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            setProducts((products) =>
              [...products, response.data].sort((a, b) =>
                a.title > b.title ? 1 : -1
              )
            )
          } else {
            toastContext.addToast({
              text: 'Wystąpił błąd podczas dodawania produktu do koszyka.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          }
        })
        .catch(function (error) {
          toastContext.addToast({
            text: 'Wystąpił błąd podczas dodawania produktu do koszyka.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        })
    } else {
      const index = products.findIndex((prod) => prod.id === product.id)
      if (index !== -1) {
        const newQuantity = setAddQuantity
          ? quantity
          : products[index].quantity + quantity
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
      redaxios
        .delete('/api/cart', {
          params: {
            productId: productId,
          },
          headers: { authorization: sessionContext.token },
        })
        .then((response) => {
          if (response.status === 204) {
            setProducts((products) =>
              products.filter((product) => product.id !== productId)
            )
          } else {
            toastContext.addToast({
              text: 'Wystąpił błąd podczas usuwania produktu z koszyka.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          }
        })
        .catch(function (error) {
          toastContext.addToast({
            text: 'Wystąpił błąd podczas usuwania produktu z koszyka.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        })
    } else {
      setProducts((products) => {
        const newProducts = products.filter(({ id }) => id !== productId)
        saveToLocalStorage(newProducts)
        return newProducts
      })
    }
  }

  const clearCart = async () => {
    if (sessionContext.user) {
      redaxios
        .delete('/api/cart', {
          headers: { authorization: sessionContext.token },
        })
        .then((response) => {
          if (response.status === 204) {
            setProducts([])
          } else {
            toastContext.addToast({
              text: 'Wystąpił błąd podczas usuwania produktów z koszyka.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          }
        })
        .catch(function (error) {
          toastContext.addToast({
            text: 'Wystąpił błąd podczas usuwania produktów z koszyka.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        })
    } else {
      setProducts([])
      saveToLocalStorage([])
    }
  }

  return (
    <CartContext.Provider
      value={{
        products,
        numberOfProducts:
          products.length > 0
            ? products.reduce((prev, product) => prev + product.quantity, 0)
            : 0,
        numberOfUniqueProducts: products.filter(
          (product) => product.quantity > 0
        ).length,
        total:
          products.length > 0
            ? products.reduce(
                (prev, product) => prev + product.price * product.quantity,
                0
              )
            : 0,
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
