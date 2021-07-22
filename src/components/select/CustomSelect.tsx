import { useState, useEffect, useRef } from 'react'
import { IoChevronDownSharp } from 'react-icons/io5'
import tw from 'tailwind-styled-components'

function CustomSelect({
  value,
  children,
  input,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onClickField,
  active = true,
}: {
  value: string
  children?: JSX.Element | JSX.Element[]
  input?: boolean
  inputValue?: string
  inputPlaceholder?: string
  onInputChange?: (text: string) => void
  onClickField?: () => void
  active?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [up, setUp] = useState(false)
  const listWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { innerHeight } = window
    const { y } = listWrapperRef.current.getBoundingClientRect()

    setTimeout(
      () => {
        if (innerHeight - y > 208) {
          setUp(false)
        } else {
          setUp(true)
        }
      },
      expanded ? 0 : 200
    )
  }, [expanded])

  return (
    <Container $expanded={expanded}>
      <FullSizeBackground
        $expanded={expanded}
        onClick={() => setExpanded(false)}
      />
      <InnerContainer>
        <ValueContainer
          onClick={() => {
            setExpanded(!expanded)
            onClickField && onClickField()
          }}>
          {input ? (
            <Input
              disabled={!active}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
            />
          ) : (
            <Value>{value}</Value>
          )}
          <IconWrapper>
            <ChevronIcon $active={active} $expanded={expanded} />
          </IconWrapper>
        </ValueContainer>
        <ListWrapper ref={listWrapperRef} $expanded={expanded} $up={up}>
          <List onClick={() => active && setExpanded(!expanded)}>
            {children}
          </List>
        </ListWrapper>
      </InnerContainer>
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-col
  items-center
  ${({ $expanded }: { $expanded: boolean }) => $expanded && 'z-100'}
  w-full
`

const FullSizeBackground = tw.div`
  fixed
  top-0
  left-0
  ${({ $expanded }: { $expanded: boolean }) => $expanded && 'w-screen h-screen'}
`
const InnerContainer = tw.div`
  relative
  flex
  flex-col
  items-center
  w-full
`

const ValueContainer = tw.div`
  flex
  flex-row
  items-center
  justify-between
  w-full
  bg-white
  border-2
  border-gray-200
  cursor-pointer
  rounded-3xl
  py-2px
  min-h-8
  min-w-70px
`

const Input = tw.input`
  w-full
  ml-3
  mr-1
  bg-white
  outline-none
`

const Value = tw.span`
  w-full
  ml-3
  mr-1
  bg-white
  appearance-none
  text-primary-color
`

const IconWrapper = tw.div`
  flex
  items-center
`

const ChevronIcon = tw(IoChevronDownSharp)`
  text-sm  
  ${({ $expanded, $active }: { $expanded: boolean; $active: boolean }) =>
    `${$expanded && 'rotate-180'} ${
      $active ? 'text-gray-600' : 'text-gray-300'
    }`}
  ml-1
  mr-2
  duration-200
`

const ListWrapper = tw.div`
  absolute
  left-0
  z-100
  w-full
  overflow-y-auto
  duration-100
  shadow-md
  thin-scrollbar
  ${({ $expanded, $up }: { $expanded: boolean; $up: boolean }) =>
    `${$expanded ? 'max-h-[208px]' : 'max-h-0'} ${
      $up ? 'bottom-full' : 'top-full'
    }
    `} 
`

const List = tw.ul`
  flex
  flex-col
  w-full
`

export default CustomSelect
