import tw from 'tailwind-styled-components'

function ParentCategoryItem({
  name,
  value,
  selected,
  onClick,
}: {
  name: string
  value: string
  selected: boolean
  onClick?: () => void
}) {
  return (
    <Container $selected={selected} onClick={onClick}>
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
  border-b
  border-gray-400
  duration-200
  group
  ${({ $selected }: { $selected: boolean }) =>
    $selected
      ? 'bg-primary-color'
      : 'bg-white cursor-pointer  hover:bg-primary-color'}
`

const NameText = tw.span`
  text-base
  font-bold
  duration-200
  ${({ $selected }: { $selected: boolean }) =>
    $selected ? 'text-white' : 'group-hover:text-white'}
`

const ValueText = tw.span`
  text-sm
  duration-200
  ${({ $selected }: { $selected: boolean }) =>
    $selected ? 'text-white' : 'text-gray-400 group-hover:text-white'}
`

export default ParentCategoryItem
