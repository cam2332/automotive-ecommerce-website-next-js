import { useState } from 'react'
import Head from 'next/head'
import MainHeader from './MainHeader'
import SideNavigation from './SideNavigation'
import SideWishList from './SideWishList'
import SideShoppingList from './SideShoppingList'
import SideUser from './SideUser'
import Footer from './Footer'
import VehicleFilter from './VehicleFilter'
import EmptyHeader from './EmptyHeader'
import SearchResultModal from './SearchResultModal'
import { useAppContext } from '../context/AppContext'

export type HeaderType = 'empty' | 'full'

function SiteWrapper({
  children,
  title,
  headerType,
  vehicleFilterHidden,
  metaDescription,
}: {
  // eslint-disable-next-line no-undef
  children: JSX.Element | JSX.Element[]
  // eslint-disable-next-line react/require-default-props
  title?: string
  headerType: HeaderType
  vehicleFilterHidden?: boolean
  metaDescription?: string
}) {
  const appContext = useAppContext()
  const LOCAL_TITLE = 'ECommerce Automotive Website'

  return (
    <div>
      <Head>
        <title>{title ? `${title} - ${LOCAL_TITLE}` : LOCAL_TITLE}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          key='description'
          name='description'
          content={metaDescription || LOCAL_TITLE}
        />
      </Head>
      {headerType === 'full' ? (
        <MainHeader
          onClickMenu={() =>
            appContext.setSideMenuVisible(!appContext.sideMenuVisible)
          }
          onClickWishList={() =>
            appContext.setSideWishListVisible(!appContext.sideWishListVisible)
          }
          onClickShoppingCart={() =>
            appContext.setSideShoppingListVisible(
              !appContext.sideShoppingListVisible
            )
          }
          onClickUser={() =>
            appContext.setSideUserVisible(!appContext.sideUserVisible)
          }
          onClickSearchIcon={() =>
            appContext.setSearchResultModalVisible(
              !appContext.searchResultModalVisible
            )
          }
        />
      ) : (
        <EmptyHeader />
      )}
      <div className='flex flex-col items-stretch justify-start w-full pt-12 lg:pt-20 min-h-screen-96px lg:items-center'>
        {headerType === 'full' && (
          <>{!vehicleFilterHidden && <VehicleFilter />}</>
        )}
        <div className='flex flex-col items-center lg:w-5xl lg:max-w-5xl'>
          {children}
        </div>
        <div>
          <SideNavigation />
          <SideWishList />
          <SideShoppingList />
          <SideUser />
          <SearchResultModal />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SiteWrapper
