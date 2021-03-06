import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import React, { useState } from 'react'
import {
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoListSharp,
} from 'react-icons/io5'
import { CgMenuGridO } from 'react-icons/cg'
import SiteWrapper from '../../components/SiteWrapper'
import CategoryNav from '../../components/CategoryNav'
import { IProduct } from '../../DAO/documents/Product'
import {
  findAll as findAllCategories,
  findRootCategoryById,
} from '../../business/CategoryManager'
import { ICategory } from '../../DAO/documents/Category'
import dbConnect from '../../utils/dbConnect'
import QuantitySelect from '../../components/select/QuantitySelect'
import CustomSelect from '../../components/select/CustomSelect'
import SimpleItem from '../../components/select/SimpleItem'
import Modal from '../../components/Modal'
import { findAll as findAllProducts } from '../../business/ProductManager'
import SortMethod from '../../DAO/types/SortMethod'
import Pagination from '../../components/Pagination'
import ProductList from '../../components/ProductList'
import CategoryCriteriaBuilder from '../../DAO/types/CategoryCriteriaBuilder'
import ProductCriteriaBuilder from '../../DAO/types/ProductCriteriaBuilder'
import PageableBuilder from '../../DAO/types/PageableBuilder'
import SortCriteriaBuilder from '../../DAO/types/SortCriteriaBuilder'

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

  const setCurrentPage = (lPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: lPage.toString() },
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
      pathname: `/category/${categoryId}`,
      query: { ...router.query },
    })
  }

  return (
    <SiteWrapper
      title={selectedCategory.name}
      headerType='full'
      metaDescription={selectedCategory.name}>
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
              value={
                selectedCategory && selectedCategory.name
                  ? selectedCategory.name
                  : ''
              }
              onClickField={() => setCategoryModalVisible(true)}
              expanded={categoryModalVisible}
            />
          </CategorySelect>
          <SettingsContainer>
            <SortSettings>
              <CustomSelect
                value={SortMethod.fromType(sortMethodType).toString()}>
                {SortMethod.values.map((option, lIndex) => (
                  <SimpleItem
                    key={SortMethod.types[lIndex]}
                    value={option}
                    selected={
                      SortMethod.fromType(sortMethodType).toString() === option
                    }
                    onClick={() => {
                      setSortMethod(
                        new SortMethod(SortMethod.types[lIndex], option)
                      )
                    }}
                  />
                ))}
              </CustomSelect>
            </SortSettings>
            <SortSettings>
              <CustomSelect value={`${resultsPerPage.toString()} produkt??w`}>
                {Array.from([5, 10, 15, 20, 30, 50]).map((option) => (
                  <SimpleItem
                    key={option.toString()}
                    value={`${option.toString()} produkt??w`}
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
          <Spacer />
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
          title='Wybierz kategori??'
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
              heightClass='h-screen sm:h-[50vh]'
            />
          )}
        </Modal>
      </Container>
    </SiteWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt(context.query.page as string, 10) || 1
  const sortMethod =
    SortMethod.fromType(context.query.sort as string) || SortMethod.relevance
  const categoryId = context.query.categoryId as string
  const resultsPerPage = parseInt(context.query.limit as string, 10) || 20
  let category: ICategory = null
  let selectedCategory: ICategory = null
  let products: IProduct[] = []
  let totalPages: number = 0

  try {
    await dbConnect()

    const allCategories = await findAllCategories(
      new CategoryCriteriaBuilder()
        .withPagination(
          new PageableBuilder().withPage(1).withSize(1000).build()
        )
        .withSort(
          new SortCriteriaBuilder()
            .withOrder('DESC')
            .withAttribute('numberOfProducts')
            .build()
        )
        .build()
    )
    const resultCategories = await findRootCategoryById(
      allCategories.results,
      categoryId
    )
    // eslint-disable-next-line no-console
    resultCategories.applyOnLeft((error) => console.log(error))

    if (resultCategories.isRight()) {
      category = resultCategories.value.category
      selectedCategory = resultCategories.value.selectedCategory

      const resultProducts = await findAllProducts(
        new ProductCriteriaBuilder()
          .withCategoriesIds(
            reduceCats(resultCategories.value.selectedCategory)
          )
          .withPagination(
            new PageableBuilder()
              .withPage(page)
              .withSize(resultsPerPage)
              .build()
          )
          .withSort(
            new SortCriteriaBuilder()
              .withOrder(sortMethod.type.includes('Asc') ? 'ASC' : 'DESC')
              .withAttribute(
                sortMethod.type.includes('name')
                  ? 'title'
                  : sortMethod.type.includes('price')
                  ? 'price'
                  : 'id'
              )
              .build()
          )
          .build()
      )

      products = resultProducts.results
      totalPages = resultProducts.totalPages
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  return {
    props: {
      selectedCategory,
      category,
      products,
      page,
      totalPages,
      sortMethodType: sortMethod.type,
      resultsPerPage,
    },
  }
}

function reduceCats(rCategory: ICategory): string[] {
  return [rCategory.id].concat(
    ...rCategory.categories.map((c) => reduceCats(c))
  )
}

const Container = tw.div`
  flex
 	flex-col
 	justify-between
 	w-full
  h-full
  duration-300

 	lg:flex-row
 	lg:w-5xl
 	lg:max-w-5xl

  xl:w-[1280px] 
  xl:max-w-[1280px] 
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

const PaginationWrapper = tw.div`
  flex
  justify-center
  p-6
`

export default index
