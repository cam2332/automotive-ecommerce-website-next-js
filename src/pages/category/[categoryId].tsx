import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import SiteWrapper from '../../components/SiteWrapper'
import CategoryNav from '../../components/CategoryNav'
import { IProduct } from '../../DAO/documents/Product'
import React, { useState } from 'react'
import { findRootCategoryById } from '../../business/CategoryManager'
import { ICategory } from '../../DAO/documents/Category'
import dbConnect from '../../utils/dbConnect'
import {
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoListSharp,
} from 'react-icons/io5'
import QuantitySelect from '../../components/select/QuantitySelect'
import { CgMenuGridO } from 'react-icons/cg'
import CustomSelect from '../../components/select/CustomSelect'
import SimpleItem from '../../components/select/SimpleItem'
import Modal from '../../components/Modal'
import { findProductsByCategoryHierarchy } from '../../business/ProductManager'
import SortMethod from '../../DAO/types/SortMethod'
import Pagination from '../../components/Pagination'
import ProductList from '../../components/ProductList'
import { authorize } from '../../business/SessionManager'

function index({
  selectedCategory,
  category,
  products,
  page,
  totalPages,
  sortMethodType,
  resultsPerPage,
}: {
  selectedCategory: ICategory
  category: ICategory
  products: IProduct[]
  page: number
  totalPages: number
  sortMethodType: string
  resultsPerPage: number
}) {
  const router = useRouter()
  const [viewType, setViewType] = useState('list')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)

  const setCurrentPage = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    })
  }

  const setSortMethod = (sortMethod: SortMethod) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sort: sortMethod.type },
    })
  }

  const setItemsPerPage = (itemsPerPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, limit: itemsPerPage },
    })
  }

  const setCategoryId = (categoryId: string) => {
    delete router.query.page
    delete router.query.categoryId
    router.push({
      pathname: '/category/' + categoryId,
      query: { ...router.query },
    })
  }

  return (
    <SiteWrapper>
      <Container>
        <Nav>
          {category && (
            <CategoryNav
              id={category.id}
              name={category.name}
              numberOfProducts={category.numberOfProducts}
              categories={category.categories}
              selectedCategoryId={selectedCategory.id}
              onClickNewCategory={(categoryId) => setCategoryId(categoryId)}
            />
          )}
        </Nav>
        <Main>
          <CategorySelect>
            <CustomSelect
              value={selectedCategory.name}
              onClickField={() => setCategoryModalVisible(true)}
              expanded={categoryModalVisible}
            />
          </CategorySelect>
          <SettingsContainer>
            <SortSettings>
              <CustomSelect
                value={SortMethod.fromType(sortMethodType).toString()}>
                {SortMethod.values.map((option, index) => (
                  <SimpleItem
                    key={SortMethod.types[index]}
                    value={option}
                    selected={
                      SortMethod.fromType(sortMethodType).toString() === option
                    }
                    onClick={() => {
                      setSortMethod(
                        new SortMethod(SortMethod.types[index], option)
                      )
                    }}
                  />
                ))}
              </CustomSelect>
            </SortSettings>
            <SortSettings>
              <CustomSelect value={resultsPerPage.toString() + ' produktów'}>
                {Array.from([5, 10, 15, 20, 30, 50]).map((option) => (
                  <SimpleItem
                    key={option.toString()}
                    value={option.toString() + ' produktów'}
                    selected={resultsPerPage === option}
                    onClick={() => {
                      setItemsPerPage(option)
                    }}
                  />
                ))}
              </CustomSelect>
            </SortSettings>
            <VisibilitySettings>
              <ViewTypeSettings>
                <ListViewType
                  $viewType={viewType}
                  onClick={() => setViewType('list')}>
                  <ListIcon />
                </ListViewType>
                <GridViewType
                  $viewType={viewType}
                  onClick={() => setViewType('grid')}>
                  <GridMenuIcon />
                </GridViewType>
              </ViewTypeSettings>
              <PagesSettings>
                <PageDecrement
                  onClick={() =>
                    setCurrentPage(Math.max(1, Math.min(totalPages, page - 1)))
                  }>
                  <ChevronBackIcon />
                </PageDecrement>
                <QuantitySelect
                  selectedValue={page}
                  numberOfOptions={totalPages}
                  onClickItem={(value: number) => setCurrentPage(value)}
                />
                <PageInfo>z {totalPages}</PageInfo>
                <PageIncrement
                  onClick={() =>
                    setCurrentPage(Math.max(1, Math.min(totalPages, page + 1)))
                  }>
                  <ChevronForwardIcon />
                </PageIncrement>
              </PagesSettings>
            </VisibilitySettings>
          </SettingsContainer>
          <Spacer></Spacer>
          <ProductList products={products} viewType={viewType} />
          {totalPages > 1 && (
            <PaginationWrapper>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(newPage: number) => setCurrentPage(newPage)}
              />
            </PaginationWrapper>
          )}
        </Main>
        <Modal
          title={'Wybierz kategorię'}
          visible={categoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}>
          {category && (
            <CategoryNav
              id={category.id}
              name={category.name}
              numberOfProducts={category.numberOfProducts}
              categories={category.categories}
              selectedCategoryId={selectedCategory.id}
              onClickNewCategory={(categoryId) => {
                setCategoryId(categoryId)
                setCategoryModalVisible(false)
              }}
              heightClass={'h-screen sm:h-[50vh]'}
            />
          )}
        </Modal>
      </Container>
    </SiteWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt(context.query.page as string) || 1,
    sortMethod =
      SortMethod.fromType(context.query.sort as string) || SortMethod.relevance,
    categoryId = context.query.categoryId as string,
    resultsPerPage = parseInt(context.query.limit as string) || 20
  let category: ICategory = null,
    selectedCategory: ICategory = null,
    products: IProduct[] = [],
    totalPages: number = 0

  try {
    await dbConnect()

    const resultCategories = await findRootCategoryById(categoryId)
    resultCategories.applyOnLeft((error) => console.log(error))
    resultCategories.applyOnRight((result) => {
      category = result.category
      selectedCategory = result.selectedCategory
    })
    const user = await authorize(context.req, context.res)
    const resultProducts = await findProductsByCategoryHierarchy(
      categoryId,
      user.isRight() ? user.value.user.id : undefined,
      page,
      resultsPerPage,
      sortMethod
    )
    resultProducts.applyOnLeft((error) => console.log(error))
    resultProducts.applyOnRight((foundProducts) => {
      products = foundProducts.results
      totalPages = foundProducts.totalPages
    })
  } catch (error) {
    console.log(error)
  }

  return {
    props: {
      selectedCategory: selectedCategory,
      category: category,
      products: products,
      page: page,
      totalPages: totalPages,
      sortMethodType: sortMethod.type,
      resultsPerPage: resultsPerPage,
    },
  }
}

const Container = tw.div`
  flex
 	flex-col
 	justify-between
 	w-full
  h-full
 	lg:flex-row
 	lg:w-5xl
 	lg:max-w-5xl
`
const Nav = tw.div`
  hidden
 	lg:flex
`
const Main = tw.div`
  flex
 	flex-col
 	w-full
  h-full
`
const CategorySelect = tw.div`
  p-4
 	md:p-6
 	lg:hidden
`
const SettingsContainer = tw.div`
  flex
 	flex-col
 	justify-between
 	sm:flex-row
  sm:px-2
`
const SortSettings = tw.div`
  flex
 	flex-row
 	items-center
 	w-full
 	p-4
  px-3
 	sm:w-full
 	md:p-6
  md:px-3
`
const VisibilitySettings = tw.div`
  flex
 	flex-row
 	items-center
 	justify-between
 	px-3
`
const ViewTypeSettings = tw.div`
  flex
 	flex-row
 	items-center
 	mr-5
 	space-x-3
`
const ListViewType = tw.div`p-3 ${({ $viewType }: { $viewType: string }) =>
  $viewType === 'list' ? 'bg-gray-100' : 'bg-white'} rounded-full cursor-pointer
    `
const GridViewType = tw.div`p-3 ${({ $viewType }: { $viewType: string }) =>
  $viewType === 'grid' ? 'bg-gray-100' : 'bg-white'} rounded-full cursor-pointer
`
const ListIcon = tw(IoListSharp)`
  text-2xl
 	text-gray-600
`
const GridMenuIcon = tw(CgMenuGridO)`
  text-2xl
 	text-gray-600
`
const PagesSettings = tw.div`
  flex
 	flex-row
 	items-center
 	space-x-3
 	select-none
`
const PageDecrement = tw.div`
  p-2
 	bg-white
 	rounded-full
 	cursor-pointer
 	hover:bg-gray-100
`
const ChevronBackIcon = tw(IoChevronBackSharp)`
  text-lg
 	text-gray-600
`
const PageInfo = tw.span`
  text-sm
 	whitespace-nowrap
`
const PageIncrement = tw.div`
  p-2
 	bg-white
 	rounded-full
 	cursor-pointer
 	hover:bg-gray-100
`
const ChevronForwardIcon = tw(IoChevronForwardSharp)`
  text-lg
 	text-gray-600
`
const Spacer = tw.div`
  h-px
 	mx-5
 	bg-gray-200
 	lg:max-w-5xl
  my-5
  sm:my-0
`
const ProductListContainer = tw.div`
  flex-col w-full ${({ $viewType }: { $viewType: string }) =>
    $viewType === 'list' ? 'flex' : 'hidden'}
`
const ProductGridContainer = tw.div`
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-2
  lg:max-w-5xl ${({ $viewType }: { $viewType: string }) =>
    $viewType === 'grid' ? 'grid' : 'hidden'}
`

const PaginationWrapper = tw.div`
  flex
  justify-center
  p-6
`

export default index
