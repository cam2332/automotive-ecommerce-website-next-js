import React from 'react'
import tw from 'tailwind-styled-components'

function Button({
  isDisabled,
  onClick,
  children,
  className,
}: {
  isDisabled: boolean
  onClick: () => void
  children: React.ReactElement | React.ReactElement[]
  className?: string
}) {
  return (
    <ButtonClasses
      className={className}
      $isDisabled={isDisabled}
      onClick={() => !isDisabled && onClick()}>
      {children}
    </ButtonClasses>
  )
}

const ButtonClasses = tw.button`
  flex
  flex-col
  items-center
  w-full
  rounded-full
  ${({ $isDisabled }: { $isDisabled: boolean }) =>
    $isDisabled
      ? `
      bg-gray-400
      cursor-default
      `
      : `
      bg-secondary-color
      hover:bg-secondary-color-hover
      `}
  p-2
  text-lg
  font-semibold
  text-body-color
`

export default Button
