import { useEffect, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'
import { IoCloseSharp, IoSearchSharp } from 'react-icons/io5'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSearchContext } from '../context/SearchContext'

function SearchResultModal() {
  const router = useRouter()
  const searchContext = useSearchContext()
  const [bigScreen, setBigScreen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setBigScreen(window.matchMedia('(min-width: 1024px)').matches)
    const handler = (e: { matches: boolean }) => setBigScreen(e.matches)
    window.matchMedia('(min-width: 1024px)').addEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow =
      searchContext.modalVisible &&
      window.matchMedia('(max-width: 640px)').matches
        ? 'hidden'
        : 'unset'
    if (searchContext.modalVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchContext.modalVisible])

  const onClose = () => {
    searchContext.setModalVisible(false)
  }

  return (
    <Wrapper onClick={onClose} $visible={searchContext.modalVisible}>
      <Container
        onClick={(e) => e.stopPropagation()}
        $visible={searchContext.modalVisible}>
        <Header>
          <CloseIcon onClick={onClose} />
          <SearchBar>
            <SearchBarInput
              ref={inputRef}
              type='text'
              placeholder='Wyszukaj w sklepie'
              value={searchContext.searchText}
              onChange={(e) => searchContext.search(e.target.value)}
            />
            <SearchBarIcon />
          </SearchBar>
        </Header>
        <ContentWrapper>
          <ResultsContainer>
            <SectionContainer>
              <SectionTitle>Produkty</SectionTitle>
              <ResultsList>
                {searchContext.resultProducts
                  .slice(0, bigScreen ? 10 : 6)
                  .map(({ id, title, price, thumbnailUrl }) => (
                    <ProductResultItem
                      key={id}
                      onClick={() => router.push(`/product/${id}`)}>
                      <ThumbnailWrapper>
                        {thumbnailUrl && (
                          <Image
                            width={40}
                            height={40}
                            layout='responsive'
                            src={thumbnailUrl}
                          />
                        )}
                      </ThumbnailWrapper>
                      <ProductNameText>{title}</ProductNameText>
                      <PriceText>
                        {price && price.toFixed(2).replace('.', ',')}
                      </PriceText>
                    </ProductResultItem>
                  ))}
              </ResultsList>
            </SectionContainer>
            <SectionContainer>
              <Spacer />
            </SectionContainer>
            <SectionContainer>
              <SectionTitle>Kategorie</SectionTitle>
              <ResultsList>
                {searchContext.resultCategories
                  .slice(0, bigScreen ? 10 : 4)
                  .map(({ id, name }) => (
                    <ProductResultItem
                      key={id}
                      onClick={() => router.push(`/category/${id}`)}>
                      <ProductNameText>{name}</ProductNameText>
                    </ProductResultItem>
                  ))}
              </ResultsList>
            </SectionContainer>
          </ResultsContainer>
        </ContentWrapper>
      </Container>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  fixed
  top-0
  left-0
  z-100
  ${({ $visible }: { $visible: boolean }) =>
    $visible ? `w-full h-full` : `w-0 h-0`}
  ${({ $visible }: { $visible: boolean }) =>
    $visible && `bg-black bg-opacity-0`}
    
  md:mt-12
  lg:mt-16
`

const Container = tw.div`
  absolute
  top-0
  left-0
  w-full
  h-full
  z-100
  duration-200
  bg-white
  border
  border-gray-300
  drop-shadow-xl
  
  md:left-44
  md:w-1/2
  md:h-auto

  lg:left-1/2
  lg:-translate-x-1/2
  lg:max-w-3xl

  ${({ $visible }: { $visible: boolean }) => !$visible && `hidden`}
`

const Header = tw.div`
  flex
  flex-row-reverse
  items-center
  justify-between
  h-12
  px-5

  md:hidden
`

const CloseIcon = tw(IoCloseSharp)`
  text-2xl
  cursor-pointer
  text-title-color
`

const ContentWrapper = tw.div`
  flex
  flex-col
  w-full
  items-stretch
`

const ResultsContainer = tw.div`
  flex
  flex-col
  w-full
  h-full
  p-4

  lg:justify-between
  lg:flex-row-reverse
`

const SectionContainer = tw.div`
  flex
  flex-col
`

const ResultsList = tw.ul`
  list-disc
`

const Spacer = tw.div`
  hidden  
  w-[1px]
  h-full
  mx-4
  bg-gray-300

  lg:flex
`

const SearchBar = tw.div`
  flex
  flex-row
  items-center
  border-2
  rounded-full
  w-full
  mr-4
`

const SearchBarIcon = tw(IoSearchSharp)`
  my-1
  mr-1
  text-2xl
  cursor-pointer
  text-primary-color
  max-h-4
  max-w-4

  lg:max-h-5
  lg:max-w-5
  lg:my-2
  lg:mr-3
  lg:ml-1
`

const SearchBarInput = tw.input`
  mr-1
  ml-3
  w-full
  text-primary-color
  text-sm

  lg:text-base
`

const SectionTitle = tw.span`
  mx-2
  my-2
  font-semibold
  text-primary-color
`

const ProductResultItem = tw.li`
  flex
  flex-row
  items-center
  justify-start
  w-full
  py-2
  px-2
  space-x-2
  cursor-pointer
  border-t
  border-gray-200

  first:border-t-0
`

const ThumbnailWrapper = tw.div`
  grid
  w-12
`

const ProductNameText = tw.span`
  text-sm
  text-gray-700
  justify-self-end
  w-full
  px-2
`

const PriceText = tw.span`
 	font-semibold
 	text-secondary-color
 	whitespace-nowrap
`

export default SearchResultModal
