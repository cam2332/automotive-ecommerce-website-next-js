import { useState, useEffect, useRef } from 'react'
import { IoChevronDownSharp } from 'react-icons/io5'
import tw from 'tailwind-styled-components'

interface ICustomSelectProps {
  value: string
  // eslint-disable-next-line no-undef
  children?: JSX.Element | JSX.Element[]
  input?: boolean
  inputValue?: string
  inputPlaceholder?: string
  onInputChange?: (text: string) => void
  onClickField?: () => void
  disabled?: boolean
  expanded?: boolean
}

function CustomSelect({
  value,
  children,
  input,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onClickField,
  disabled,
  expanded,
}: ICustomSelectProps) {
  const [lExpanded, setLExpanded] = useState<boolean>(expanded || false)
  const [up, setUp] = useState(false)
  const listWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLExpanded(expanded)
  }, [expanded])

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
      lExpanded ? 0 : 200
    )
  }, [lExpanded])

  return (
    <Container $expanded={lExpanded}>
      <FullSizeBackground
        $expanded={!disabled && lExpanded}
        onClick={() => setLExpanded(false)}
      />
      <InnerContainer $active={!disabled}>
        <ValueContainer
          onClick={() => {
            if (!disabled) {
              setLExpanded(!lExpanded)
              onClickField?.()
            }
          }}>
          {input ? (
            <Input
              disabled={disabled}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
            />
          ) : (
            <Value $active={!disabled}>{value}</Value>
          )}
          <IconWrapper>
            <ChevronIcon
              $active={!disabled}
              $expanded={!disabled && lExpanded}
            />
          </IconWrapper>
        </ValueContainer>
        <ListWrapper
          ref={listWrapperRef}
          $expanded={!disabled && lExpanded}
          $up={up}>
          <List onClick={() => !disabled && setLExpanded(!lExpanded)}>
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
  select-none
  ${({ $active }: { $active: boolean }) =>
    $active ? 'cursor-pointer' : 'cursor-default'}
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
  text-sm
`

const Value = tw.span`
  w-full
  ml-3
  mr-1
  bg-white
  appearance-none
  text-sm
  ${({ $active }: { $active: boolean }) =>
    $active ? 'text-primary-color' : 'text-gray-400'}
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
