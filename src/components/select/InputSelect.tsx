import CustomSelect from './CustomSelect'
import SimpleItem from './SimpleItem'

function InputSelect({
  value,
  options,
  onClickItem,
  inputValue,
  inputPlaceholder,
  onInputChange,
}: {
  value: string
  options: { id: string; value: string }[]
  onClickItem: (value: string) => void
  inputValue: string
  inputPlaceholder?: string
  onInputChange: (text: string) => void
}) {
  return (
    <CustomSelect
      value={value}
      input={true}
      inputValue={inputValue}
      inputPlaceholder={inputPlaceholder}
      onInputChange={onInputChange}>
      {options.map((option) => (
        <SimpleItem
          key={option.id}
          value={value}
          selected={option.id === value}
          onClick={() => onClickItem(option.id)}
        />
      ))}
    </CustomSelect>
  )
}

export default InputSelect
