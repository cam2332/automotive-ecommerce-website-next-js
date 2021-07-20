import { useRef, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import EmptyHeader from '../../components/EmptyHeader'
import Footer from '../../components/Footer'
import InputText from '../../components/InputText'
import Link from '../../components/form/Link'
import Form from '../../components/form/Form'
import {
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordsEqualValidator,
  passwordValidator,
} from '../../services/FormValidation'

function Register() {
  const router = useRouter()
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

  // implement register functionality
  const register = () => {}

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
              <Link onClick={() => router.push('/account/login')}>Zaloguj</Link>
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
