import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import EmptyHeader from '../../components/EmptyHeader'
import Footer from '../../components/Footer'
import InputText from '../../components/InputText'
import Form from '../../components/form/Form'
import Link from '../../components/form/Link'
import {
  emailValidator,
  passwordValidator,
} from '../../services/FormValidation'

function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  useEffect(() => {
    setIsFormValid(
      email !== '' &&
        password !== '' &&
        !emailInputRef.current.hasError() &&
        !passwordInputRef.current.hasError()
    )
  }, [email, password])

  // implement login functionality
  const login = () => {}

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
            title='Logowanie'
            fields={[
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
                }}
                placeholder='Hasło'
                inputType='password'
                autoComplete='current-password'
              />,
            ]}
            submitButtonText='Zaloguj'
            links={[
              <Link onClick={() => router.push('/account/register')}>
                Rejestracja
              </Link>,
              <Link onClick={() => router.push('/account/reset')}>
                Nie pamiętasz hasła?
              </Link>,
            ]}
            isFormValid={isFormValid}
            onClickSubmit={() => login()}
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

export default Login
