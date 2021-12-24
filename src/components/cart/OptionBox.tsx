import { IoCheckmark } from 'react-icons/io5'
import tw from 'tailwind-styled-components'

interface OptionBoxProps {
  selected: boolean
  icon: any
  firstText: string
  secondText: string
  onClick: () => void
}

let IIcon: any
function OptionBox({
  selected,
  icon,
  firstText,
  secondText,
  onClick,
}: OptionBoxProps) {
  IIcon = icon
  const borderColor = selected
    ? 'border-primary-color-400'
    : 'border-gray-200 hover:border-gray-500 group-hover:border-gray-500'

  const textColor = selected ? 'text-primary-color-400' : 'text-gray-500'

  return (
    <Wrapper onClick={onClick}>
      <Container $borderColor={borderColor}>
        <SelectionIndicator>
          <SelectionCheckmarkBorder $borderColor={borderColor}>
            <CheckmarkIcon $isSelected={selected} />
          </SelectionCheckmarkBorder>
        </SelectionIndicator>
        <IIcon
          className={`m-1  cursor-pointer  text-3xl  lg:text-4xl  ${textColor}`}
        />
        <FirstText $textColor={textColor}>{firstText}</FirstText>
        <SecondText $textColor={textColor} $secondText={secondText}>
          {secondText || '-'}
        </SecondText>
      </Container>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  mt-5
`

const Container = tw.div`
  flex
  flex-col
  items-center
  justify-center
  p-5
  m-1
  border
  cursor-pointer
  group
  ${({ $borderColor }: { $borderColor: string }) => $borderColor}
`

const SelectionIndicator = tw.div`
  absolute 
  flex 
  items-center 
  justify-center 
  p-4 
  bg-white 
  rounded-full 
  mt-[-120px] 
  w-7 
  h-7
`

const SelectionCheckmarkBorder = tw.div`
  flex
  items-center
  justify-center
  p-1
  m-2
  bg-white
  border
  rounded-full 
  ${({ $borderColor }: { $borderColor: string }) => $borderColor}
`

const CheckmarkIcon = tw(IoCheckmark)`
text-sm ${({ $isSelected }: { $isSelected: boolean }) =>
  $isSelected ? 'text-primary-color-400' : 'text-white'}
`

const FirstText = tw.span`
  text-sm
  ${({ $textColor }: { $textColor: string }) => $textColor}
  whitespace-nowrap
`

const SecondText = tw.span`
  text-sm
  ${({
    $textColor,
    $secondText,
  }: {
    $textColor: string
    $secondText: string
  }) => ($secondText ? $textColor : 'text-white')}
  whitespace-nowrap
`
// `
//   text-sm
//   ${({ $textColor }: { $textColor: string }) => $textColor}
//   whitespace-nowrap
// `

export default OptionBox
