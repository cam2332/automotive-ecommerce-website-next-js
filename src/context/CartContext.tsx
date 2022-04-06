import React, { createContext, useContext, useEffect, useState } from 'react'
import redaxios from 'redaxios'
import { IProduct } from '../DAO/documents/Product'
import CartProduct from '../DAO/types/CartProduct'
import { useSessionContext } from './SessionContext'
import { useToastContext } from './ToastContext'

type CartContextProps = {
  products: CartProduct[]
  numberOfProducts: number
  numberOfUniqueProducts: number
  total: number
  currency: string
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

// eslint-disable-next-line react/prop-types
const CartProvider: React.FC = ({ children }): React.ReactElement => {
  const sessionContext = useSessionContext()
  const toastContext = useToastContext()
  const [products, setProducts] = useState<CartProduct[]>([])
  const [currency, setCurrency] = useState<string>('zł')

  const saveToLocalStorage = (products: CartProduct[]) => {
    localStorage.setItem(
      'cart',
      JSON.stringify(
        products.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        }))
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
            setProducts(response.data.results || [])
          } else {
            setProducts([])
          }
        })
        .catch(() => {
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
            .then((response) => {
              if (response.status === 200) {
                setProducts(response.data.results)
                response.data?.results[0]?.currency?.length > 0 &&
                  setCurrency(response.data.results[0].currency)
              } else {
                setProducts([])
                saveToLocalStorage([])
              }
            })
            .catch(() => {
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
    amountToAdd: number,
    setAddQuantity?: boolean
  ): Promise<void> => {
    if (sessionContext.user) {
      redaxios
        .put(
          '/api/cart',
          {
            productId: product.id,
            quantity: amountToAdd,
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
            setProducts((products) => {
              const otherProducts = products.filter(
                (localProduct) => localProduct.id !== response.data.id
              )
              return [...otherProducts, response.data].sort((a, b) =>
                a.title > b.title ? 1 : -1
              )
            })
          } else {
            toastContext.addToast({
              text: 'Wystąpił błąd podczas dodawania produktu do koszyka.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          }
        })
        .catch((error) => {
          if (error.status === 409) {
            toastContext.addToast({
              text: 'W koszyku jest już maksymalna ilość wybranego produktu.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          } else {
            toastContext.addToast({
              text: 'Wystąpił błąd podczas dodawania produktu do koszyka.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          }
        })
    } else {
      const index = products.findIndex((prod) => prod.id === product.id)
      if (index !== -1) {
        const newQuantity = setAddQuantity
          ? amountToAdd
          : products[index].selectedAmount + amountToAdd
        if (newQuantity > product.quantity) {
          toastContext.addToast({
            text: 'W koszyku jest już maksymalna ilość wybranego produktu.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        }
        products[index].selectedAmount = newQuantity
        setProducts((products) => {
          const newProductList = [...products]
          saveToLocalStorage(newProductList)
          return newProductList
        })
      } else {
        setProducts((products) => {
          const newProductList = [
            ...products,
            { ...product, selectedAmount: amountToAdd },
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
            productId,
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
        .catch(() => {
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
        .catch(() => {
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
            ? products.reduce(
                (prev, product) => prev + product.selectedAmount,
                0
              )
            : 0,
        numberOfUniqueProducts: products.filter(
          (product) => product.selectedAmount > 0
        ).length,
        total:
          products.length > 0
            ? products.reduce(
                (prev, product) =>
                  prev + product.price * product.selectedAmount,
                0
              )
            : 0,
        currency,
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
