import { useState, useEffect } from 'react'
import InputSelect from './InputSelect'
import SimpleItem from './SimpleItem'

const groupOptions = (
  options: { id: string; value: string; group?: string }[],
  field: string
) => {
  const groups = Object.create(null)
  options.forEach((option) => {
    if (option[field]) {
      if (groups) groups[option[field]] = groups[option[field]] || []
      groups[option[field]].push(option)
    } else {
      groups['_group'] = groups['_group'] || []
      groups['_group'].push(option)
    }
  })
  return groups
}

function VehicleFilterSelect({
  value,
  options,
  onClickItem,
  inputPlaceholder,
  onClickField,
  active,
  groupBy,
  expanded,
}: {
  value: string
  options: { id: string; value: string; group?: string }[]
  onClickItem: ({ id, value }: { id: string; value: string }) => void
  inputPlaceholder: string
  onClickField?: () => void
  active: boolean
  groupBy?: string
  expanded?: boolean
}) {
  const [inputValue, setInputValue] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState(
    groupBy ? groupOptions(options, groupBy || '_group') : options
  )

  useEffect(() => {
    if (groupBy) {
      if (inputValue != '') {
        const groups = groupOptions(options, groupBy || '_group')
        Object.keys(groups).map((key) => {
          const filteredGroup = groups[key].filter((value) =>
            value.value.toLowerCase().includes(inputValue.toLowerCase())
          )

          if (filteredGroup.length > 0) {
            groups[key] = filteredGroup
          } else {
            delete groups[key]
          }
        })
        setFilteredOptions(groups)
      } else {
        setFilteredOptions(groupOptions(options, groupBy || '_group'))
      }
    } else {
      if (inputValue != '') {
        setFilteredOptions(
          options.filter((value) =>
            value.value.toLowerCase().includes(inputValue.toLowerCase())
          )
        )
      } else {
        setFilteredOptions(options)
      }
    }
  }, [inputValue, options])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <InputSelect
      value={value}
      onClickItem={(item) => {
        onClickItem(item)
        setInputValue(item.value)
      }}
      inputValue={inputValue}
      inputPlaceholder={inputPlaceholder}
      onInputChange={(text) => setInputValue(text)}
      onClickField={() => {
        if (inputValue.length > 0) {
          setInputValue('')
          onClickField()
        } else {
          setInputValue(value)
        }
      }}
      active={active}
      expanded={expanded}>
      {groupBy &&
        Object.keys(filteredOptions)
          .map((key) => {
            const items = []
            items.push(
              <SimpleItem
                key={key}
                value={key}
                selected={false}
                onClick={() => {
                  /** */
                }}
              />
            )
            filteredOptions[key].forEach((item) => {
              items.push(
                <SimpleItem
                  key={item.id}
                  value={item.value}
                  selected={item.value === value}
                  onClick={() => onClickItem(item)}
                />
              )
            })
            return items
          })
          .reduce((acc, items) => acc.concat(items), [])}
      {!groupBy &&
        filteredOptions.map((option) => (
          <SimpleItem
            key={option.id}
            value={option.value}
            selected={option.value === value}
            onClick={() => onClickItem(option)}
          />
        ))}
    </InputSelect>
  )
}

export default VehicleFilterSelect
