import { useState, useEffect, useRef } from 'react'
import { IoChevronUpSharp } from 'react-icons/io5'
import tw from 'tailwind-styled-components'

function CustomSelect({
  value,
  children,
}: {
  value: string
  children?: JSX.Element | JSX.Element[]
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
    <Container>
      <FullSizeBackground
        $expanded={expanded}
        onClick={() => setExpanded(false)}
      />
      <InnerContainer>
        <ValueContainer onClick={() => setExpanded(!expanded)}>
          <Value>{value}</Value>
          <IconWrapper>
            <ChevronIcon $expanded={expanded} />
          </IconWrapper>
        </ValueContainer>
        <ListWrapper ref={listWrapperRef} $expanded={expanded} $up={up}>
          <List onClick={() => setExpanded(!expanded)}>{children}</List>
        </ListWrapper>
      </InnerContainer>
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-col
  items-center
  flex-auto
  z-100
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

const ChevronIcon = tw(IoChevronUpSharp)`
  text-sm
  text-gray-600
  ${({ $expanded }: { $expanded: boolean }) => !$expanded && 'rotate-180'}
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