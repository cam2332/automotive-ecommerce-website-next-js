import tw from 'tailwind-styled-components'
import { IoCloseSharp } from 'react-icons/io5'

function SideMenu({
  title,
  isRight,
  onClose,
  visible,
  children,
  contentPaddingClass,
  containerClassName,
}: {
  title?: string
  isRight?: boolean
  onClose: () => void
  visible: boolean
  // eslint-disable-next-line no-undef
  children?: JSX.Element | JSX.Element[] | undefined
  contentPaddingClass?: string
  containerClassName?: string
}) {
  return (
    <Wrapper onClick={onClose} $visible={visible}>
      <Container
        className={containerClassName}
        onClick={(e) => e.stopPropagation()}
        $visible={visible}
        $isRight={isRight}>
        <Header>
          <CloseIcon onClick={onClose} $isRight={isRight} />
          {title && <TitleText>{title}</TitleText>}
        </Header>
        <Content $paddingClass={contentPaddingClass}>{children}</Content>
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
`

const Container = tw.div`
  fixed
  top-0
  w-[70%]
  h-full
  z-100
  duration-300
  bg-white
  shadow-lg
  ${({ $visible, $isRight }: { $visible: boolean; $isRight: boolean }) =>
    $visible
      ? $isRight
        ? `right-0`
        : `left-0`
      : $isRight
      ? `-right-full sm:hidden`
      : `-left-full sm:hidden`}
  sm:w-[350px]
  sm:top-14
  sm:right-2
  sm:h-auto
  max-h-screen

  lg:top-20
  lg:right-50%-512px
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
  ${({ $isRight }: { $isRight: boolean }) => !$isRight && 'order-2'}
`

const TitleText = tw.span`
  text-lg
  font-semibold
  text-primary-color
`

const Content = tw.div`
  flex
  flex-col
  items-stretch
  ${({ $paddingClass }: { $paddingClass?: string }) => $paddingClass || 'p-5'}
`

export default SideMenu
