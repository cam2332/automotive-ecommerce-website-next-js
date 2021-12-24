import { useEffect } from 'react'
import tw from 'tailwind-styled-components'
import { IoCloseSharp } from 'react-icons/io5'

function Modal({
  title,
  onClose,
  visible,
  children,
}: {
  title: string
  onClose: () => void
  visible: boolean
  // eslint-disable-next-line no-undef
  children?: JSX.Element | JSX.Element[]
}) {
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : 'unset'
  }, [visible])

  return (
    <Wrapper onClick={onClose} $visible={visible}>
      <Container onClick={(e) => e.stopPropagation()} $visible={visible}>
        <Header>
          <CloseIcon onClick={onClose} />
          <TitleText>{title}</TitleText>
        </Header>
        <ContentWrapper>{children}</ContentWrapper>
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
    $visible && `bg-black bg-opacity-60`}
`

const Container = tw.div`
  absolute
  top-0
  left-0
  w-full
  h-full
  z-100
  duration-500
  bg-white
  shadow-2xl
  
  sm:top-1/2
  sm:left-1/2
  sm:w-350px
  sm:h-auto
  sm:-translate-x-1/2
  sm:-translate-y-1/2
  ${({ $visible }: { $visible: boolean }) => !$visible && `hidden`}
`

const Header = tw.div`
  flex
  flex-row-reverse
  items-center
  justify-between
  h-12
  px-5
`

const CloseIcon = tw(IoCloseSharp)`
  text-2xl
  cursor-pointer
  text-title-color
`

const TitleText = tw.span`
  text-lg
  font-semibold
  text-primary-color
`

const ContentWrapper = tw.div`
  flex
  flex-col
  w-full
  items-stretch
`

export default Modal
