import tw from 'tailwind-styled-components'

function SimpleItem({
  value,
  selected,
  onClick,
}: {
  value: string
  selected: boolean
  onClick?: () => void
}) {
  return (
    <Item $selected={selected} onClick={onClick}>
      <Container>
        <ValueText $selected={selected}>{value}</ValueText>
      </Container>
    </Item>
  )
}

const Item = tw.li`
  group
  w-full
  border-b  
  cursor-pointer
  ${({ $selected }: { $selected: boolean }) =>
    $selected
      ? 'border-primary-color bg-primary-color'
      : 'border-gray-100 bg-white hover:bg-primary-color-300'}
`

const Container = tw.div`
  flex
  items-center
  w-full
  pl-2
`

const ValueText = tw.span`
  mx-2
  leading-6
  group-hover:text-white
  ${({ $selected }: { $selected: boolean }) => $selected && 'text-white'}
  text-sm
`

export default SimpleItem
