import CustomSelect from './CustomSelect'

function InputSelect({
  value,
  children,
  onClickItem,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onClickField,
  active,
}: {
  value: string
  children?: JSX.Element | JSX.Element[]
  onClickItem: ({ id, value }: { id: string; value: string }) => void
  inputValue: string
  inputPlaceholder?: string
  onInputChange: (text: string) => void
  onClickField?: () => void
  active?: boolean
}) {
  return (
    <CustomSelect
      value={value}
      input={true}
      inputValue={inputValue}
      inputPlaceholder={inputPlaceholder}
      onInputChange={onInputChange}
      onClickField={() => onClickField && onClickField()}
      active={active}>
      {children}
    </CustomSelect>
  )
}

export default InputSelect
