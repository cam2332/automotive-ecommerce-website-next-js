import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import tw from 'tailwind-styled-components'
import { GetServerSidePropsContext } from 'next'
import EmptyHeader from '../../components/EmptyHeader'
import Footer from '../../components/Footer'
import InputText from '../../components/InputText'
import Form from '../../components/form/Form'
import {
  emailValidator,
  passwordValidator,
} from '../../services/FormValidation'
import { useSessionContext } from '../../context/SessionContext'
import { useToastContext } from '../../context/ToastContext'
import { userFromRequest } from '../../services/Tokens'

function Login() {
  const router = useRouter()
  const sessionContext = useSessionContext()
  const toastContext = useToastContext()
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

  const login = async () => {
    const result = await sessionContext.signIn({
      email,
      password,
    })
    toastContext.removeAllToasts()
    if (result.isRight()) {
      router.push('/')
    } else {
      if (result.value[1] === 404) {
        emailInputRef.current.setErrorValue(true, result.value[0])
      }
      if (result.value[1] === 401) {
        passwordInputRef.current.setErrorValue(true, result.value[0])
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
        <title>Logowanie - ECommerce Automotive Website</title>
        <link rel='icon' href='/favicon.ico' />
        <meta key='description' name='description' content='Logowanie' />
      </Head>
      <EmptyHeader />
      <PageContainer>
        <FormWrapper>
          <Form
            title='Logowanie'
            fields={[
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
                }}
                placeholder='Has??o'
                inputType='password'
                autoComplete='current-password'
              />,
            ]}
            submitButtonText='Zaloguj'
            links={[
              <Link key='register' href='/account/register'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className='text-sm underline'>Rejestracja</a>
              </Link>,
              <Link key='forgotPassword' href='/account/reset'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className='text-sm underline'>Nie pami??tasz has??a?</a>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await userFromRequest(context.req)

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const PageContainer = tw.div`
  flex
  flex-col
  w-full
  h-screen
  -mb-24

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
