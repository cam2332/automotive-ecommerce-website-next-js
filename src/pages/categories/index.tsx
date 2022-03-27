import { GetServerSideProps } from 'next'
import CategoryList from '../../components/CategoryList'
import SiteWrapper from '../../components/SiteWrapper'
import { ICategory } from '../../DAO/documents/Category'
import { findAll } from '../../business/CategoryManager'
import dbConnect from '../../utils/dbConnect'
import CategoryCriteriaBuilder from '../../DAO/types/CategoryCriteriaBuilder'
import PageableBuilder from '../../DAO/types/PageableBuilder'
import SortCriteriaBuilder from '../../DAO/types/SortCriteriaBuilder'

function index({ categories }: { categories: ICategory[] }) {
  return (
    <SiteWrapper
      title='Kategorie'
      headerType='full'
      metaDescription='Kategorie'>
      <CategoryList title='Wszystkie kategorie' categories={categories} />
    </SiteWrapper>
  )
}

export default index

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categories: ICategory[] = []
  try {
    await dbConnect()
    const foundCategories = await findAll(
      new CategoryCriteriaBuilder()
        .withPagination(new PageableBuilder().withPage(1).withSize(100).build())
        .withSort(
          new SortCriteriaBuilder()
            .withOrder('DESC')
            .withAttribute('numberOfProducts')
            .build()
        )
        .build()
    )
    categories = foundCategories.results
  } catch (error) {
    console.log(error)
  }

  return {
    props: {
      categories,
    },
  }
}
