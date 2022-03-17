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
import { useSearchContext } from '../context/SearchContext'

export type HeaderType = 'empty' | 'full'

function SiteWrapper({
  children,
  title,
  headerType,
  vehicleFilterHidden,
}: {
  // eslint-disable-next-line no-undef
  children: JSX.Element | JSX.Element[]
  // eslint-disable-next-line react/require-default-props
  title?: string
  headerType: HeaderType
  vehicleFilterHidden?: boolean
}) {
  const searchContext = useSearchContext()
  const [sideMenuVisible, setSideMenuVisible] = useState(false)
  const [sideWishListVisible, setSideWishListVisible] = useState(false)
  const [sideShoppingListVisible, setSideShoppingListVisible] = useState(false)
  const [sideUserVisible, setSideUserVisible] = useState(false)
  const LOCAL_TITLE = 'ECommerce Automotive Website'

  return (
    <div>
      <Head>
        <title>{title ? `${title} - ${LOCAL_TITLE}` : LOCAL_TITLE}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {headerType === 'full' ? (
        <MainHeader
          onClickMenu={() => setSideMenuVisible(!sideMenuVisible)}
          onClickWishList={() => setSideWishListVisible(!sideWishListVisible)}
          onClickShoppingCart={() =>
            setSideShoppingListVisible(!sideShoppingListVisible)
          }
          onClickUser={() => setSideUserVisible(!sideUserVisible)}
          onClickSearchIcon={() =>
            searchContext.setModalVisible(!searchContext.modalVisible)
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
          <SideNavigation
            visible={sideMenuVisible}
            onClose={() => setSideMenuVisible(false)}
          />
          <SideWishList
            visible={sideWishListVisible}
            onClose={() => setSideWishListVisible(false)}
          />
          <SideShoppingList
            visible={sideShoppingListVisible}
            onClose={() => setSideShoppingListVisible(false)}
          />
          <SideUser
            visible={sideUserVisible}
            onClose={() => setSideUserVisible(false)}
          />
          <SearchResultModal />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SiteWrapper
