import { GetServerSideProps } from 'next'
import SiteWrapper from '../components/SiteWrapper'
import CategoryList from '../components/CategoryList'
import { ICategory } from '../DAO/documents/Category'
import dbConnect from '../utils/dbConnect'
import { findAll } from '../business/CategoryManager'
import { ResultData } from '../DAO/types/ResultData'
import CategoryCriteriaBuilder from '../DAO/types/CategoryCriteriaBuilder'
import PageableBuilder from '../DAO/types/PageableBuilder'
import SortCriteriaBuilder from '../DAO/types/SortCriteriaBuilder'

export default function Home({ categories }: { categories: ICategory[] }) {
  return (
    <SiteWrapper headerType='full'>
      <CategoryList title='Wybrane kategorie' categories={categories} />
    </SiteWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categories: ResultData<ICategory[]>
  try {
    await dbConnect()
    categories = await findAll(
      new CategoryCriteriaBuilder()
        .withPagination(new PageableBuilder().withPage(1).withSize(9).build())
        .withSort(
          new SortCriteriaBuilder()
            .withOrder('DESC')
            .withAttribute('numberOfProducts')
            .build()
        )
        .build()
    )
  } catch (error) {
    console.log(error)
  }

  return {
    props: {
      categories: categories.results,
    },
  }
}
