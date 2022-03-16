import tw from 'tailwind-styled-components'
import { IoSearchSharp } from 'react-icons/io5'
import { useAppContext } from '../context/AppContext'

function SearchField() {
  const appContext = useAppContext()

  return (
    <MainWrapper>
      <Container>
        <TextInput
          type='text'
          placeholder='Wyszukaj w sklepie'
          value={appContext.searchText}
          onChange={(e) => appContext.setSearchText(e.target.value)}
        />
        <SearchIcon />
      </Container>
    </MainWrapper>
  )
}

const MainWrapper = tw.div`
  flex
 	flex-col
 	items-center
  mx-4
   
 	lg:hidden
 	lg:w-5xl
 	lg:max-w-5xl
`
const Container = tw.div`
  flex
 	flex-row
 	items-center
 	w-full
 	mx-4
 	my-4
	py-1
 	duration-500
 	border-2
 	rounded-full
`
const SearchIcon = tw(IoSearchSharp)`
 	ml-1
	mr-3
 	text-xl
 	cursor-pointer
 	text-primary-color
`
const TextInput = tw.input`
  mr-1
 	ml-3
 	w-full
 	text-primary-color
	text-sm
`
export default SearchField
