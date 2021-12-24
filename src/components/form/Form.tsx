import React from 'react'
import tw from 'tailwind-styled-components'
import { InputTextProps } from '../InputText'
import { LinkProps } from './Link'
import SubmitButton from './SubmitButton'

function Form({
  title,
  fields,
  submitButtonText,
  links,
  isFormValid,
  onClickSubmit,
}: {
  title: string
  fields?:
    | React.ReactElement<InputTextProps>
    | React.ReactElement<InputTextProps>[]
  submitButtonText: string
  links?: React.ReactElement<LinkProps> | React.ReactElement<LinkProps>[]
  isFormValid: boolean
  onClickSubmit: () => void
}) {
  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>{title}</FormTitle>
      </FormHeader>
      <FormInnerContainer
        onSubmit={(e) => {
          e.preventDefault()
          onClickSubmit()
        }}>
        <FormFieldsContainer>
          {Array.isArray(fields)
            ? [
                ...fields,
                <input className='hidden' key='submit' type='button' />,
              ]
            : [fields, <input className='hidden' key='submit' type='button' />]}
        </FormFieldsContainer>
        <LinksContainer>{links}</LinksContainer>
        <SubmitButton isFormValid={isFormValid} onClick={onClickSubmit}>
          {submitButtonText}
        </SubmitButton>
      </FormInnerContainer>
    </FormContainer>
  )
}

const FormContainer = tw.div`
  flex
  flex-col
  items-center
  w-90%
  max-w-lg
  border
  border-gray-200
`

const FormHeader = tw.div`
  flex
  flex-row
  w-full
  items-center
  justify-between
  h-12
  px-5
  bg-gray-100
`

const FormTitle = tw.span`
  text-lg
  font-semibold
  text-primary-color
`

const FormInnerContainer = tw.form`
  flex
  flex-col
  items-center
  justify-center
  w-90%
  py-5
  pt-10
  space-y-5
`

const FormFieldsContainer = tw.div`
  flex
  flex-col
  items-center
  justify-center
  w-full
  space-y-5
`

const LinksContainer = tw.div`
  flex
  flex-col
  items-start
  w-full
  space-y-2
  py-2
`

export default Form
