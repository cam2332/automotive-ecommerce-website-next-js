import { GetServerSideProps } from 'next'
import tw from 'tailwind-styled-components'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  IoCardOutline,
  IoCartOutline,
  IoCashOutline,
  IoHomeOutline,
  IoLogoGoogle,
} from 'react-icons/io5'
import { FaSms } from 'react-icons/fa'
import { HiOutlineTruck } from 'react-icons/hi'
import { authorize } from '../../business/SessionManager'
import CartProductCard from '../../components/cart/CartProductCard'
import SiteWrapper from '../../components/SiteWrapper'
import dbConnect from '../../utils/dbConnect'
import { useCartContext } from '../../context/CartContext'
import InputText from '../../components/InputText'
import Button from '../../components/Button'
import { useToastContext } from '../../context/ToastContext'
import OptionBox from '../../components/cart/OptionBox'

type DeliveryType = 'Courier' | 'InPost'

type PaymentType = 'PaymentCard' | 'GooglePay' | 'CashOnDelivery'

type AdditionalServiceType = 'None' | 'SMSNotification'

const deliveryPrice = { Courier: 24.99, InPost: 0 }

const paymentPrice = { PaymentCard: 0, GooglePay: 0, CashOnDelivery: 4.95 }

const additionalServicePrice = { None: 0, SMSNotification: 0.99 }

export default function index() {
  const router = useRouter()
  const cartContext = useCartContext()
  const toastContext = useToastContext()
  const [discountCode, setDiscountCode] = useState<string>('')
  const [totalDiscount, setTotalDiscount] = useState<number>(0)
  const [isDiscountApplied, setIsDiscountApplied] = useState<boolean>(false)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Courier')
  const [paymentType, setPaymentType] = useState<PaymentType>('PaymentCard')
  const [additionalServiceType, setAdditionalServiceType] =
    useState<AdditionalServiceType>('None')
  const summary = () =>
    cartContext.total +
    deliveryPrice[deliveryType] +
    paymentPrice[paymentType] +
    additionalServicePrice[additionalServiceType] -
    totalDiscount

  return (
    <SiteWrapper title='Koszyk' headerType='empty' metaDescription='Koszyk'>
      {cartContext.numberOfUniqueProducts > 0 ? (
        <>
          <SectionWrapper>
            <SectionTitle>Lista produktów</SectionTitle>
            {cartContext.products.map((product) => (
              <CartProductCard
                key={product.id}
                product={product}
                onClickTitle={() => {
                  router.push(`/product/${product.id}`)
                }}
                onClickSetAmount={(amount) => {
                  cartContext.addToCart(product, amount, true)
                }}
                onClickRemove={() => {
                  cartContext.removeFromCart(product.id)
                }}
              />
            ))}
          </SectionWrapper>
          <SectionWrapper>
            <SectionTitle>Kod rabatowy</SectionTitle>
            <SectionDiscountContainer>
              <InputText
                value={discountCode}
                placeholder='Kod rabatowy'
                inputType='text'
                onChangeText={(text) => setDiscountCode(text)}
                inputWrapperClassName='rounded-none'
              />
              <Button
                className='w-1/2 py-[10px] rounded-none'
                isDisabled={discountCode.length === 0 || isDiscountApplied}
                onClick={() => {
                  const discountAmount = summary() / 2
                  setTotalDiscount(discountAmount)
                  setIsDiscountApplied(true)
                  toastContext.addToast({
                    text: `Zaoszczędzono ${discountAmount
                      .toFixed(2)
                      .replace('.', ',')} ${
                      cartContext.currency
                    } dzięki kodowi rabatowemu '${discountCode}'.`,
                    appearance: 'info',
                    autoDismiss: true,
                    dismissDelay: 5000,
                  })
                }}>
                <span
                  className={`text-base ${
                    discountCode.length > 0 ? 'text-white' : 'text-gray-500'
                  }`}>
                  Zastosuj
                </span>
              </Button>
            </SectionDiscountContainer>
          </SectionWrapper>
          <SectionWrapper>
            <SectionTitle>Dostawa</SectionTitle>
            <SectionDeliveryContainer>
              <OptionBox
                selected={deliveryType === 'Courier'}
                icon={HiOutlineTruck}
                firstText={'Kurier'}
                secondText={`${
                  deliveryPrice['Courier'] > 0
                    ? deliveryPrice['Courier'].toFixed(2).replace('.', ',')
                    : 0
                } zł`}
                onClick={() => setDeliveryType('Courier')}
              />
              <OptionBox
                selected={deliveryType === 'InPost'}
                icon={IoHomeOutline}
                firstText={'InPost'}
                secondText={`${
                  deliveryPrice['InPost'] > 0
                    ? deliveryPrice['InPost'].toFixed(2).replace('.', ',')
                    : 0
                } zł`}
                onClick={() => setDeliveryType('InPost')}
              />
            </SectionDeliveryContainer>
          </SectionWrapper>
          <SectionWrapper>
            <SectionTitle>Płatność</SectionTitle>
            <SectionPaymentContainer>
              <OptionBox
                selected={paymentType === 'PaymentCard'}
                icon={IoCardOutline}
                firstText={'Karta płatnicza'}
                secondText={`${
                  paymentPrice['PaymentCard'] > 0
                    ? paymentPrice['PaymentCard'].toFixed(2).replace('.', ',')
                    : 0
                } zł`}
                onClick={() => setPaymentType('PaymentCard')}
              />
              <OptionBox
                selected={paymentType === 'GooglePay'}
                icon={IoLogoGoogle}
                firstText={'Google Pay'}
                secondText={`${
                  paymentPrice['GooglePay'] > 0
                    ? paymentPrice['GooglePay'].toFixed(2).replace('.', ',')
                    : 0
                } zł`}
                onClick={() => setPaymentType('GooglePay')}
              />
              <OptionBox
                selected={paymentType === 'CashOnDelivery'}
                icon={IoCashOutline}
                firstText={'Gotówka przy odbiorze'}
                secondText={`${
                  paymentPrice['CashOnDelivery'] > 0
                    ? paymentPrice['CashOnDelivery']
                        .toFixed(2)
                        .replace('.', ',')
                    : 0
                } zł`}
                onClick={() => setPaymentType('CashOnDelivery')}
              />
            </SectionPaymentContainer>
          </SectionWrapper>
          <SectionWrapper>
            <SectionTitle>Usługi dodatkowe</SectionTitle>
            <SectionAdditionalServicesContainer>
              <OptionBox
                selected={additionalServiceType === 'SMSNotification'}
                icon={FaSms}
                firstText={'Powiadomienie SMS'}
                secondText={`${
                  additionalServicePrice['SMSNotification'] > 0
                    ? additionalServicePrice['SMSNotification']
                        .toFixed(2)
                        .replace('.', ',')
                    : 0
                } zł`}
                onClick={() => {
                  setAdditionalServiceType(
                    additionalServiceType === 'SMSNotification'
                      ? 'None'
                      : 'SMSNotification'
                  )
                }}
              />
            </SectionAdditionalServicesContainer>
          </SectionWrapper>
          <SummarySectionWrapper>
            <SectionTitle>Podsumowanie koszyka</SectionTitle>
            <SummarySectionContainer>
              <SummaryRow>
                <SmallText>Wartość produktów</SmallText>
                <SmallText>
                  {cartContext.total.toFixed(2).replace('.', ',')}{' '}
                  {cartContext.currency}
                </SmallText>
              </SummaryRow>
              {totalDiscount > 0 && (
                <SummaryRow>
                  <SmallText className='text-red-700'>
                    Przyznany rabat
                  </SmallText>
                  <SmallText className='text-red-700'>
                    -{totalDiscount.toFixed(2).replace('.', ',')}{' '}
                    {cartContext.currency}
                  </SmallText>
                </SummaryRow>
              )}
              {deliveryPrice[deliveryType] > 0 && (
                <SummaryRow>
                  <SmallText>Koszt transportu</SmallText>
                  <SmallText>
                    {deliveryPrice[deliveryType].toFixed(2).replace('.', ',')}{' '}
                    {cartContext.currency}
                  </SmallText>
                </SummaryRow>
              )}
              {paymentPrice[paymentType] > 0 && (
                <SummaryRow>
                  <SmallText>Koszt płatności</SmallText>
                  <SmallText>
                    {paymentPrice[paymentType].toFixed(2).replace('.', ',')}{' '}
                    {cartContext.currency}
                  </SmallText>
                </SummaryRow>
              )}
              {additionalServicePrice[additionalServiceType] > 0 && (
                <SummaryRow>
                  <SmallText>Koszt usług</SmallText>
                  <SmallText>
                    {additionalServicePrice[additionalServiceType]
                      .toFixed(2)
                      .replace('.', ',')}{' '}
                    {cartContext.currency}
                  </SmallText>
                </SummaryRow>
              )}
              <SummaryRow>
                <SmallText className='text-2xl font-medium'>Łącznie</SmallText>
                <SmallText className='text-2xl font-medium'>
                  {summary().toFixed(2).replace('.', ',')}{' '}
                  {cartContext.currency}
                </SmallText>
              </SummaryRow>
            </SummarySectionContainer>
          </SummarySectionWrapper>
          <SectionWrapper>
            <CheckoutButton
              isDisabled={false}
              onClick={() => {
                /** */
              }}>
              <CheckoutButtonText>Przejdź dalej</CheckoutButtonText>
            </CheckoutButton>
          </SectionWrapper>
        </>
      ) : (
        <>
          <EmptyCartText>Twój koszyk jest pusty</EmptyCartText>
          <LargeCartIcon />
        </>
      )}
    </SiteWrapper>
  )
}

const SectionWrapper = tw.div`
  flex
 	flex-col
 	py-3
  px-3
  w-full
  border-b
  pb-7
`

const SummarySectionWrapper = tw(SectionWrapper)`
  border-b-0 
  space-y-4
`

const SectionTitle = tw.span`
  text-lg
  my-3
  font-semibold
  text-primary-color
`

const SectionDiscountContainer = tw.div`
  flex 
  flex-row 
  items-center 
  
  md:w-1/2 
  lg:w-2/5
`

const SectionDeliveryContainer = tw.div`
  grid 
  grid-cols-3 
  
  lg:grid-cols-5
`

const SectionPaymentContainer = tw.div`
  grid 
  grid-cols-3 
  
  lg:grid-cols-5
`

const SectionAdditionalServicesContainer = tw.div`
  grid 
  grid-cols-3 
  
  lg:grid-cols-5
`

const SummarySectionContainer = tw.div`
  md:w-1/2 
  lg:w-2/5
`

const SmallText = tw.span`
  py-1
  text-primary-color
`

const SummaryRow = tw.div`
  flex
  flex-row
  flex-1
  justify-between
`

const EmptyCartText = tw.span`
  flex
  items-center
  h-full
  justify-center
  text-3xl
  pt-10
  py-3
`

const LargeCartIcon = tw(IoCartOutline)`
  text-9xl
  text-primary-color
`

const CheckoutButton = tw(Button)`
  p-3 
  
  md:w-1/2 
  lg:w-2/5
`

const CheckoutButtonText = tw.div`
  text-2xl 
  text-white
`

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await dbConnect()
    const authorized = await authorize(context.req, context.res)
    if (authorized.isLeft()) {
      return {
        redirect: {
          destination: '/account/login',
          permanent: false,
        },
      }
    }
  } catch (error) {
    console.log(error)
  }

  return {
    props: {},
  }
}
