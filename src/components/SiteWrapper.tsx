import { useState } from 'react'
import Head from 'next/head'
import MainHeader from './MainHeader'
import SideNavigation from '../components/SideNavigation'
import SideWishList from './SideWishList'
import SideShoppingList from '../components/SideShoppingList'
import SideUser from '../components/SideUser'
import Footer from '../components/Footer'
import SearchField from './SearchField'
import VehicleFilter from './VehicleFilter'

function SiteWrapper({
  children,
  title,
}: {
  children: JSX.Element | JSX.Element[]
  title?: string
}) {
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
      <MainHeader
        onClickMenu={() => setSideMenuVisible(!sideMenuVisible)}
        onClickWishList={() => setSideWishListVisible(!sideWishListVisible)}
        onClickShoppingCart={() =>
          setSideShoppingListVisible(!sideShoppingListVisible)
        }
        onClickUser={() => setSideUserVisible(!sideUserVisible)}
      />
      <div className='flex flex-col items-stretch justify-start w-full pt-12 lg:pt-20 min-h-screen-96px lg:items-center'>
        <SearchField />
        <VehicleFilter />
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
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SiteWrapper
