import tw from 'tailwind-styled-components'

function CategoryItem({
  name,
  value,
  selected,
  onClick,
  level,
}: {
  name: string
  value: string
  selected: boolean
  onClick?: () => void
  level: number
}) {
  return (
    <Container
      style={{ paddingLeft: level * 15 + 'px' }}
      $paddingLeft={level}
      $selected={selected}
      onClick={onClick}>
      <NameText $selected={selected}>{name}</NameText>
      <ValueText $selected={selected}>{value}</ValueText>
    </Container>
  )
}

const Container = tw.li`
  flex
  flex-row
  items-center
  justify-between
  px-2
  py-3
  space-x-2
  border-b
  border-gray-200  
  ${({
    $paddingLeft,
    $selected,
  }: {
    $paddingLeft: number
    $selected: boolean
  }) =>
    `${' pl-[' + $paddingLeft * 4 + 'px] '} 
    ${
      $selected
        ? 'bg-primary-color-50'
        : ' bg-white cursor-pointer hover:bg-primary-color-100'
    }`}
`

const NameText = tw.span`
  text-sm
  ${({ $selected }: { $selected: boolean }) =>
    $selected && 'font-semibold text-primary-color'}
`

const ValueText = tw(NameText)`
  text-gray-400
  ${({ $selected }: { $selected: boolean }) => $selected && 'font-semibold'}
`

export default CategoryItem
