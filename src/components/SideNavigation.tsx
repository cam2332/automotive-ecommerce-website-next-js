import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import { IoChevronForwardSharp } from 'react-icons/io5'
import redaxios from 'redaxios'
import SideMenu from './SideMenu'
import { ICategory } from '../DAO/documents/Category'

function SideNavigation({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const router = useRouter()
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
          setCategories(response.data.value)
        } else {
          setCategories([])
        }
      })
      .catch((error) => {
        setCategories([])
      })
  }, [])

  return (
    <SideMenu
      title={'Kategorie'}
      isRight={false}
      onClose={onClose}
      visible={visible}
      contentPaddingClass='p-5 pt-0 pr-0 pb-0'>
      <ListWrapper ref={divRef} style={{ height: computedHeight }}>
        <List>
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <ListElement
                key={category.id}
                onClick={() => {
                  router.push('/category/' + category.id)
                }}>
                <span>{category.name}</span>
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
