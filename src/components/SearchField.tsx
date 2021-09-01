import tw from 'tailwind-styled-components'
import { IoSearchSharp } from 'react-icons/io5'
import { useAppContext } from '../context/AppContext'

function SearchField() {
  const appContext = useAppContext()

  return (
    <MainWrapper>
      <Container>
        <SearchIcon />
        <TextInput
          type='text'
          placeholder='Wyszukaj w sklepie'
          value={appContext.searchText}
          onChange={(e) => appContext.setSearchText(e.target.value)}
        />
      </Container>
    </MainWrapper>
  )
}

const MainWrapper = tw.div`
  flex
 	flex-col
 	items-center
  px-4
   
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
 	my-8
 	duration-500
 	border-2
 	rounded-full
`
const SearchIcon = tw(IoSearchSharp)`
  my-2
 	ml-3
 	mr-1
 	text-2xl
 	cursor-pointer
 	text-primary-color
`
const TextInput = tw.input`
  ml-1
 	mr-3
 	w-90%
 	text-primary-color
`
export default SearchField
