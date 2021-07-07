import tw from 'tailwind-styled-components'

function SubmitButton({
  isFormValid,
  onClick,
  children,
}: {
  isFormValid: boolean
  onClick: () => void
  children: string
}) {
  return (
    <SubmitButtonClasses
      disabled={!isFormValid}
      $isFormValid={isFormValid}
      onClick={onClick}>
      {children}
    </SubmitButtonClasses>
  )
}

const SubmitButtonClasses = tw.button`
  flex
  flex-col
  items-center
  w-full
  rounded-full
  ${({ $isFormValid }: { $isFormValid: boolean }) =>
    $isFormValid
      ? `
      bg-secondary-color
      hover:bg-secondary-color-hover
      `
      : `
      bg-gray-400
      cursor-default
      `}
  p-2
  text-lg
  font-semibold
  text-body-color
`

export default SubmitButton
