import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import tw from 'tailwind-styled-components'
import EmptyHeader from '../../components/EmptyHeader'
import Footer from '../../components/Footer'
import InputText from '../../components/InputText'
import Form from '../../components/form/Form'
import { emailValidator } from '../../services/FormValidation'

function Reset() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const emailInputRef = useRef(null)

  useEffect(() => {
    setIsFormValid(email !== '' && !emailInputRef.current.hasError())
  }, [email])

  // implement reset functionality
  const reset = () => {}

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
            title='Zmiana hasła'
            fields={
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
              />
            }
            links={[
              <Link key='register' href='/account/register'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className='text-sm underline'>Rejestracja</a>
              </Link>,
              <Link key='login' href='/account/login'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className='text-sm underline'>Logowanie</a>
              </Link>,
            ]}
            isFormValid={isFormValid}
            submitButtonText='Resetuj hasło'
            onClickSubmit={() => reset()}
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

export default Reset
