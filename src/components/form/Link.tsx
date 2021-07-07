import tw from 'tailwind-styled-components'

export interface LinkProps {
  onClick: () => void
  children: string
}

function Link({ onClick, children }: LinkProps) {
  return <LinkClasses onClick={onClick}>{children}</LinkClasses>
}

const LinkClasses = tw.a`
  text-sm
  underline
  cursor-pointer
`

export default Link
