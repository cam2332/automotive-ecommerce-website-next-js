import React from 'react'
import { useRouter } from 'next/router'
import Header from './Header'

function EmptyHeader() {
  const router = useRouter()

  return (
    <Header
      logoText='Auto części'
      onClickLogo={() => router.push('/')}
      contactPhoneNumber='01 234 56 78'
      contactInfoVisible
    />
  )
}

export default EmptyHeader
