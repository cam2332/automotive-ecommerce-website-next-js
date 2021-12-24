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
  expanded,
}: {
  value: string
  // eslint-disable-next-line no-undef
  children?: JSX.Element | JSX.Element[]
  onClickItem: ({ id, value }: { id: string; value: string }) => void
  inputValue: string
  inputPlaceholder?: string
  onInputChange: (text: string) => void
  onClickField?: () => void
  active?: boolean
  expanded?: boolean
}) {
  return (
    <CustomSelect
      value={value}
      input
      inputValue={inputValue}
      inputPlaceholder={inputPlaceholder}
      onInputChange={onInputChange}
      onClickField={() => onClickField && onClickField()}
      disabled={!active}
      expanded={expanded}>
      {children}
    </CustomSelect>
  )
}

export default InputSelect
