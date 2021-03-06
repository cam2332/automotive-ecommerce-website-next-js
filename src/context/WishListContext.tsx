import React, { createContext, useContext, useEffect, useState } from 'react'
import redaxios from 'redaxios'
import { IProduct } from '../DAO/documents/Product'
import { useSessionContext } from './SessionContext'
import { useToastContext } from './ToastContext'

type WishListContextProps = {
  products: IProduct[]
  numberOfProducts: number
  addToWishList: (product: IProduct) => Promise<boolean>
  removeFromWishList: (productId: string) => Promise<boolean>
  clearWishList: () => Promise<void>
  isInWishList: (productId: string) => boolean
}

export const WishListContext = createContext<WishListContextProps>(
  {} as WishListContextProps
)

// eslint-disable-next-line react/prop-types
const WishListProvider: React.FC = ({ children }): React.ReactElement => {
  const sessionContext = useSessionContext()
  const toastContext = useToastContext()
  const [products, setProducts] = useState<IProduct[]>([])

  const saveToLocalStorage = (products: IProduct[]) => {
    localStorage.setItem(
      'wishList',
      JSON.stringify(products.map((product) => product.id))
    )
  }

  useEffect(() => {
    if (sessionContext.token) {
      redaxios
        .get('/api/wishlist', {
          headers: { authorization: sessionContext.token },
        })
        .then((response) => {
          if (response.status === 200) {
            setProducts(response.data.results || [])
          } else {
            setProducts([])
          }
        })
        .catch((error) => {
          setProducts([])
          toastContext.addToast({
            text: 'Wystąpił błąd podczas pobierania produktów do listy życzeń.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
        })
    } else {
      try {
        const localWishList: string[] = JSON.parse(
          localStorage.getItem('wishList')
        )
        if (Array.isArray(localWishList) && localWishList.length > 0) {
          redaxios
            .get('/api/products', {
              params: {
                ids: localWishList,
              },
            })
            .then((response) => {
              if (response.status === 200) {
                setProducts(response.data.results)
              } else {
                setProducts([])
                saveToLocalStorage([])
              }
            })
            .catch((error) => {
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

  // eslint-disable-next-line consistent-return
  const addToWishList = async (product: IProduct): Promise<boolean> => {
    if (sessionContext.user) {
      redaxios
        .put(
          '/api/wishlist',
          {
            productId: product.id,
          },
          {
            params: {
              headers: { authorization: sessionContext.token },
            },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            setProducts((products) =>
              [...products, response.data].sort((a: IProduct, b: IProduct) =>
                a.title > b.title ? 1 : -1
              )
            )
            return true
          }
          toastContext.addToast({
            text: 'Wystąpił błąd podczas dodawania produktu do listy życzeń.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
          return false
        })
        .catch(() => {
          toastContext.addToast({
            text: 'Wystąpił błąd podczas dodawania produktu do listy życzeń.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
          return false
        })
    } else {
      setProducts((products) => {
        const newProductList = [...products, product]
        saveToLocalStorage(newProductList)
        return newProductList
      })
      return true
    }
  }

  // eslint-disable-next-line consistent-return
  const removeFromWishList = async (productId: string): Promise<boolean> => {
    if (sessionContext.user) {
      redaxios
        .delete('/api/wishlist', {
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
            return true
          }
          toastContext.addToast({
            text: 'Wystąpił błąd podczas usuwania produktu z listy życzeń.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
          return false
        })
        .catch(() => {
          toastContext.addToast({
            text: 'Wystąpił błąd podczas usuwania produktu z listy życzeń.',
            appearance: 'error',
            autoDismiss: true,
            dismissDelay: 5000,
          })
          return false
        })
    } else {
      setProducts((products) => {
        const newProducts = products.filter(({ id }) => id !== productId)
        saveToLocalStorage(newProducts)
        return newProducts
      })
      return true
    }
  }

  const clearWishList = async (): Promise<void> => {
    if (sessionContext.user) {
      redaxios
        .delete('/api/wishlist', {
          headers: { authorization: sessionContext.token },
        })
        .then((response) => {
          if (response.status === 204) {
            setProducts([])
          } else {
            toastContext.addToast({
              text: 'Wystąpił błąd podczas usuwania produktów z listy życzeń.',
              appearance: 'error',
              autoDismiss: true,
              dismissDelay: 5000,
            })
          }
        })
        .catch(() => {
          toastContext.addToast({
            text: 'Wystąpił błąd podczas usuwania produktów z listy życzeń.',
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

  const isInWishList = (productId: string): boolean =>
    products.findIndex((product) => product.id === productId) >= 0

  return (
    <WishListContext.Provider
      value={{
        products,
        numberOfProducts: products.length,
        addToWishList,
        removeFromWishList,
        clearWishList,
        isInWishList,
      }}>
      {children}
    </WishListContext.Provider>
  )
}

export function useWishListContext() {
  const state = useContext(WishListContext)

  if (state === undefined) {
    throw new Error(
      'useWishListContext must be used within an WishListProvider'
    )
  }

  return state
}

export default WishListProvider
