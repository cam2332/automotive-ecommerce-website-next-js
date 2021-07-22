import CustomSelect from './CustomSelect'
import SimpleItem from './SimpleItem'

function InputSelect({
  value,
  options,
  onClickItem,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onClickField,
  active,
}: {
  value: string
  options: { id: string; value: string }[]
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
      {options.map((option) => (
        <SimpleItem
          key={option.id}
          value={option.value}
          selected={option.value === value}
          onClick={() => onClickItem(option)}
        />
      ))}
    </CustomSelect>
  )
}

export default InputSelect
