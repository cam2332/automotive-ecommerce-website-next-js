import { GetServerSideProps } from 'next'
import CategoryList from '../../components/CategoryList'
import SiteWrapper from '../../components/SiteWrapper'
import { ICategory } from '../../DAO/documents/Category'
import { findAllCategories } from '../../business/CategoryManager'
import dbConnect from '../../utils/dbConnect'

function index({ categories }: { categories: ICategory[] }) {
  return (
    <SiteWrapper>
      <CategoryList title='Wszystkie kategorie' categories={categories} />
    </SiteWrapper>
  )
}

export default index

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categories: ICategory[] = []
  try {
    await dbConnect()
    const foundCategories = await findAllCategories(true)
    foundCategories.applyOnRight((cats) => {
      categories = cats
    })
  } catch (error) {
    console.log(error)
  }

  return {
    props: {
      categories: categories,
    },
  }
}
