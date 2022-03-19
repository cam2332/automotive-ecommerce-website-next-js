import React, { useEffect, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'
import Button from '../../components/Button'
import InputText from '../../components/InputText'
import SiteWrapper from '../../components/SiteWrapper'
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
} from '../../services/FormValidation'

export default function index() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const firstNameInputRef = useRef(null)
  const lastNameInputRef = useRef(null)
  const emailInputRef = useRef(null)

  useEffect(() => {
    setIsFormValid(
      firstName !== '' &&
        lastName !== '' &&
        email !== '' &&
        message.length < 5 &&
        !firstNameInputRef.current.hasError() &&
        !lastNameInputRef.current.hasError() &&
        !emailInputRef.current.hasError()
    )
  }, [firstName, lastName, email, message])

  // implement sending messages
  const sendMessage = async () => {}

  return (
    <SiteWrapper
      title='Kontakt'
      headerType='full'
      vehicleFilterHidden
      metaDescription='Kontakt i wysyłanie opinii'>
      <MainContainer>
        <SectionWrapper>
          <SectionTitle>Podziel się opinią</SectionTitle>
          <RowWrapper>
            <InputText
              key='firstName'
              ref={firstNameInputRef}
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text)
                const [isFirstNameInvalid, invalidFirstNameText] =
                  firstNameValidator(text)
                firstNameInputRef.current.setErrorValue(
                  isFirstNameInvalid,
                  invalidFirstNameText
                )
              }}
              placeholder='Imię'
              inputType='text'
              autoComplete='given-name'
            />
            <InputText
              key='lastName'
              ref={lastNameInputRef}
              value={lastName}
              onChangeText={(text) => {
                setLastName(text)
                const [isLastNameInvalid, invalidLastNameText] =
                  lastNameValidator(text)
                lastNameInputRef.current.setErrorValue(
                  isLastNameInvalid,
                  invalidLastNameText
                )
              }}
              placeholder='Nazwisko'
              inputType='text'
              autoComplete='family-name'
            />
            <InputText
              key='email'
              ref={emailInputRef}
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                const [isEmailInvalid, invalidEmailText] = emailValidator(text)
                emailInputRef.current.setErrorValue(
                  isEmailInvalid,
                  invalidEmailText
                )
              }}
              placeholder='E-mail'
              inputType='email'
              autoComplete='email'
            />
            <MessageTextArea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setMessage(e.target.value)
                } else {
                  setMessage(message)
                }
              }}
              placeholder='Treść (Minimum 5 znaków, maximum 250 znaków)'
            />
            <SendButton onClick={sendMessage} isDisabled={!isFormValid}>
              <SendText>Wyślij</SendText>
            </SendButton>
          </RowWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <SectionTitle>Kontakt</SectionTitle>
          <RowWrapper>
            <span className='inline-block text-gray-500'>
              ul. Nowicki 35651, Suite 306, 39-661, <br /> Strzyżów,
              Małopolskie, Poland
              <br />
              <br />
              <a href='tel:01 234 56 78'>01 234 56 78</a>
              <br />
              <a href='mailto:info@autoczesci.pl'>info@autoczesci.pl</a>
            </span>
          </RowWrapper>
        </SectionWrapper>
      </MainContainer>
    </SiteWrapper>
  )
}

const MainContainer = tw.div`
  w-full  
  flex
  flex-col
  items-center

  lg:flex-row
  lg:items-start
  lg:space-x-14
  lg:px-4
`

const SectionWrapper = tw.div`
  w-90% 
  flex
 	flex-col
 	my-5
  space-y-4

  border
  border-gray-200

  md:w-2/3
  lg:w-1/2
`

const RowWrapper = tw.div`
  pt-7
  pb-5
  mx-7
  space-y-5
`

const SectionTitle = tw.h1`
  h-12
  px-5
  py-3
  bg-gray-100
  text-lg
  font-semibold
  text-primary-color
`

const SendText = tw.span`
  flex
 	text-sm
 	uppercase
`

const SendButton = tw(Button)`
  p-2
`

const MessageTextArea = tw.textarea`
  w-full 
  p-2 
  border 
  border-gray-100 
  outline-none 
  resize-none 
  h-40
`
