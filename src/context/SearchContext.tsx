import React, { createContext, useContext, useState } from 'react'
import redaxios from 'redaxios'
import { ICategory } from '../DAO/documents/Category'
import { IProduct } from '../DAO/documents/Product'

type SearchContextProps = {
  searchText: string
  search: (value: string) => void
  resultProducts: IProduct[]
  resultCategories: ICategory[]
}

export const SearchContext = createContext<SearchContextProps>(
  {} as SearchContextProps
)

// eslint-disable-next-line react/prop-types
const SearchProvider: React.FC = ({ children }): React.ReactElement => {
  const [searchText, setSearchText] = useState('')
  const [resultProducts, setResultProducts] = useState([])
  const [resultCategories, setResultCategories] = useState([])

  const search = async (value: string) => {
    setSearchText(value)
    if (value && value.length > 0) {
      redaxios
        .get('/api/products', {
          params: {
            title: value,
            page: 1,
            resultsPerPage: 10,
            sortMethod: 'nameAsc',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setResultProducts(response.data.results || [])
          } else {
            setResultProducts([])
          }
        })
        .catch(() => {
          setResultProducts([])
        })
      redaxios
        .get('/api/categories', {
          params: {
            name: value,
            page: 1,
            resultsPerPage: 10,
            sortMethod: 'nameAsc',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setResultCategories(response.data.results || [])
          } else {
            setResultCategories([])
          }
        })
        .catch(() => {
          setResultCategories([])
        })
    } else {
      setResultProducts([])
      setResultCategories([])
    }
  }

  return (
    <SearchContext.Provider
      value={{
        searchText,
        search: (value: string) => {
          search(value)
        },
        resultProducts,
        resultCategories,
      }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext() {
  const state = useContext(SearchContext)

  if (state === undefined) {
    throw new Error(`useSearchContext must be used within an SearchProvider`)
  }

  return state
}

export default SearchProvider
