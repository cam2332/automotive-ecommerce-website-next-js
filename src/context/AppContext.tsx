import { createContext, useContext, useState } from 'react'

type AppContextProps = {
  wishListCount: number
  cartCount: number
  cartTotal: number
  searchText: string
  setSearchText: (value: string) => void
  selectedCarMake: string
  setSelectedCarMake: (value: string) => void
  selectedCarModel: string
  setSelectedCarModel: (value: string) => void
  selectedCarType: string
  setSelectedCarType: (value: string) => void
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps)

const AppProvider: React.FC = ({ children }): React.ReactElement => {
  const [wishListCount, setWishListCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0.0)
  const [searchText, setSearchText] = useState('')
  const [selectedCarMake, setSelectedCarMake] = useState('')
  const [selectedCarModel, setSelectedCarModel] = useState('')
  const [selectedCarType, setSelectedCarType] = useState('')

  return (
    <AppContext.Provider
      value={{
        wishListCount: wishListCount,
        cartCount: cartCount,
        cartTotal: cartTotal,
        searchText: searchText,
        setSearchText: setSearchText,
        selectedCarMake: selectedCarMake,
        setSelectedCarMake: setSelectedCarMake,
        selectedCarModel: selectedCarModel,
        setSelectedCarModel: setSelectedCarModel,
        selectedCarType: selectedCarType,
        setSelectedCarType: setSelectedCarType,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const state = useContext(AppContext)

  if (state === undefined) {
    throw new Error('useAppState must be used within an AppProvider')
  }

  return state
}

export default AppProvider
