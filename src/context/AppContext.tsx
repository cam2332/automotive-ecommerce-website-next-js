import React, { createContext, useContext, useState } from 'react'

type AppContextProps = {
  wishListCount: number
  cartCount: number
  cartTotal: number
  searchText: string
  setSearchText: (value: string) => void
  selectedCarMake: {
    id: string
    value: string
  }
  setSelectedCarMake: ({ id, value }: { id: string; value: string }) => void
  selectedCarModel: {
    id: string
    value: string
  }
  setSelectedCarModel: ({ id, value }: { id: string; value: string }) => void
  selectedCarType: {
    id: string
    value: string
  }
  setSelectedCarType: ({ id, value }: { id: string; value: string }) => void
  carMakes: string[]
  setCarMakes: (values: string[]) => void
  carModels: string[]
  setCarModels: (values: string[]) => void
  carTypes: string[]
  setCarTypes: (values: string[]) => void
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps)

// eslint-disable-next-line react/prop-types
const AppProvider: React.FC = ({ children }): React.ReactElement => {
  const [wishListCount, setWishListCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0.0)
  const [searchText, setSearchText] = useState('')
  const [selectedCarMake, setSelectedCarMake] = useState({ id: '', value: '' })
  const [selectedCarModel, setSelectedCarModel] = useState({
    id: '',
    value: '',
  })
  const [selectedCarType, setSelectedCarType] = useState({ id: '', value: '' })

  const [carMakes, setCarMakes] = useState([])
  const [carModels, setCarModels] = useState([])
  const [carTypes, setCarTypes] = useState([])

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
        carMakes,
        carModels,
        carTypes,
        setCarMakes,
        setCarModels,
        setCarTypes,
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
