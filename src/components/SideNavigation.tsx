import { useEffect, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'
import { IoChevronForwardSharp } from 'react-icons/io5'
import redaxios from 'redaxios'
import Link from 'next/link'
import SideMenu from './SideMenu'
import { ICategory } from '../DAO/documents/Category'
import { useAppContext } from '../context/AppContext'

function SideNavigation() {
  const appContext = useAppContext()
  const [categories, setCategories] = useState<ICategory[]>([])
  const divRef = useRef<HTMLDivElement>(null)

  const [computedHeight, setComputedHeight] = useState(0)

  useEffect(() => {
    if (divRef && divRef.current) {
      setComputedHeight(
        window.screen.height -
          (window.screen.height -
            document.body.getBoundingClientRect().bottom) -
          divRef.current.getBoundingClientRect().top
      )
    }
  })

  useEffect(() => {
    redaxios
      .get('/api/categories')
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data.results || [])
        } else {
          setCategories([])
        }
      })
      .catch(() => {
        setCategories([])
      })
  }, [])

  const onClose = () => {
    appContext.setSideMenuVisible(false)
  }

  return (
    <SideMenu
      title='Kategorie'
      isRight={false}
      onClose={onClose}
      visible={appContext.sideMenuVisible}
      contentPaddingClass='p-5 pt-0 pr-0 pb-0'>
      <ListWrapper ref={divRef} style={{ height: computedHeight }}>
        <List>
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <ListElement
                key={category.id}
                onClick={() => {
                  appContext.setSideMenuVisible(false)
                }}>
                <Link href={`/category/${category.id}`}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>{category.name}</a>
                </Link>
                <IoChevronForwardSharp />
              </ListElement>
            ))}
        </List>
      </ListWrapper>
    </SideMenu>
  )
}

const ListWrapper = tw.div`
  flex 
  flex-col 
  items-start
`

const List = tw.div`
  flex 
  flex-col 
  w-full 
  py-5 
  pl-0 
  space-y-5 
  overflow-auto 
  thin-scrollbar
`

const ListElement = tw.div`
  flex 
  flex-row 
  items-center 
  justify-between 
  cursor-pointer 
  hover:underline mr-2
`

export default SideNavigation
