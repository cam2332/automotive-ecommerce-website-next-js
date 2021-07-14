import CustomSelect from './CustomSelect'
import SimpleItem from './SimpleItem'

function QuantitySelect({
  selectedValue,
  numberOfOptions,
  onClickItem,
}: {
  selectedValue: number
  numberOfOptions: number
  onClickItem: (value: number) => void
}) {
  return (
    <CustomSelect value={selectedValue.toString()}>
      {Array(numberOfOptions)
        .fill(null)
        .map((_, i) => i + 1)
        .map((value) => (
          <SimpleItem
            key={value}
            value={value.toString()}
            selected={value === selectedValue}
            onClick={() => onClickItem(value)}
          />
        ))}
    </CustomSelect>
  )
}

export default QuantitySelect
