import { forwardRef, useState, useImperativeHandle } from 'react'
import tw from 'tailwind-styled-components'

export interface InputTextProps {
  value: string
  onChangeText: (value: string) => void
  placeholder: string
  inputType: string
  autoComplete?: string
  inputWrapperClassName?: string
}

const InputText = forwardRef(function (
  {
    value,
    onChangeText,
    placeholder,
    inputType,
    autoComplete,
    inputWrapperClassName,
  }: InputTextProps,
  ref
) {
  const [error, setError] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string>('')

  const onBlur = () => {
    if (!value || value.length === 0) {
      setError(true)
      setErrorText('')
    }
  }

  useImperativeHandle(ref, () => ({
    setErrorValue(error: boolean, errorText: string) {
      setError(error)
      setErrorText(errorText)
    },

    hasError() {
      return error
    },
  }))

  return (
    <div className='relative flex flex-col w-full'>
      <div
        className={`flex flex-col items-center w-full my-2 border-2 rounded-full py-2 ${inputWrapperClassName} ${
          error && 'border-red-500'
        }`}>
        <input
          className='mx-3 w-90% text-primary-color'
          autoComplete={autoComplete || 'on'}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
        />
      </div>
      <span className='absolute text-sm text-red-500 -bottom-3'>
        {errorText}
      </span>
    </div>
  )
})

export default InputText
