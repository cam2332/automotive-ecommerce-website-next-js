import React, { useRef, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import tw from 'tailwind-styled-components'
import EmptyHeader from '../../components/EmptyHeader'
import Footer from '../../components/Footer'
import InputText from '../../components/InputText'
import Form from '../../components/form/Form'
import {
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordsEqualValidator,
  passwordValidator,
} from '../../services/FormValidation'
import { useSessionContext } from '../../context/SessionContext'
import { useToastContext } from '../../context/ToastContext'

function Register() {
  const router = useRouter()
  const sessionContext = useSessionContext()
  const toastContext = useToastContext()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const firstNameInputRef = useRef(null)
  const lastNameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)

  useEffect(() => {
    setIsFormValid(
      firstName !== '' &&
        lastName !== '' &&
        email !== '' &&
        password !== '' &&
        confirmPassword !== '' &&
        !firstNameInputRef.current.hasError() &&
        !lastNameInputRef.current.hasError() &&
        !emailInputRef.current.hasError() &&
        !passwordInputRef.current.hasError() &&
        !confirmPasswordInputRef.current.hasError()
    )
  }, [email, password, confirmPassword])

  const register = async () => {
    const result = await sessionContext.signUp({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    })
    toastContext.removeAllToasts()
    if (result.isRight()) {
      router.push('/')
    } else {
      if (result.value[1] === 409) {
        emailInputRef.current.setErrorValue(true, result.value[0])
      }
      toastContext.addToast({
        appearance: 'error',
        autoDismiss: true,
        dismissDelay: 5000,
        text: result.value[0],
      })
      setIsFormValid(false)
    }
  }

  return (
    <div>
      <Head>
        <title>ECommerce Automotive Website</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <EmptyHeader />
      <PageContainer>
        <FormWrapper>
          <Form
            title='Rejestracja'
            fields={[
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
              />,
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
                autoComplete='given-name'
              />,
              <InputText
                key='email'
                ref={emailInputRef}
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  const [isEmailInvalid, invalidEmailText] =
                    emailValidator(text)
                  emailInputRef.current.setErrorValue(
                    isEmailInvalid,
                    invalidEmailText
                  )
                }}
                placeholder='E-mail'
                inputType='email'
                autoComplete='email'
              />,
              <InputText
                key='password'
                ref={passwordInputRef}
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  const [isPasswordInvalid, errorText] = passwordValidator(text)
                  passwordInputRef.current.setErrorValue(
                    isPasswordInvalid,
                    errorText
                  )
                  const [arePasswordsNotEqual, notEqualErrorText] =
                    passwordsEqualValidator(text, confirmPassword)
                  confirmPasswordInputRef.current.setErrorValue(
                    arePasswordsNotEqual,
                    notEqualErrorText
                  )
                }}
                placeholder='Hasło'
                inputType='password'
                autoComplete='new-password'
              />,
              <InputText
                key='confirmPassword'
                ref={confirmPasswordInputRef}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text)
                  const [arePasswordsNotEqual, notEqualErrorText] =
                    passwordsEqualValidator(password, text)
                  confirmPasswordInputRef.current.setErrorValue(
                    arePasswordsNotEqual,
                    notEqualErrorText
                  )
                }}
                placeholder='Powtórz hasło'
                inputType='password'
                autoComplete='new-password'
              />,
            ]}
            submitButtonText='Zarejestruj'
            links={
              <Link key='login' href='/account/login'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className='text-sm underline'>Logowanie</a>
              </Link>
            }
            isFormValid={isFormValid}
            onClickSubmit={() => register()}
          />
        </FormWrapper>
      </PageContainer>
      <Footer />
    </div>
  )
}

const PageContainer = tw.div`
  flex
  flex-col
  w-full
  h-screen
  -mb-21

  lg:items-center
`

const FormWrapper = tw.div`
  flex
  flex-col
  items-center
  pt-20

  lg:w-5xl
  lg:max-w-5xl
`

export default Register
