import SiteWrapper from '../components/SiteWrapper'
import CategoryList from '../components/CategoryList'
import { GetServerSideProps } from 'next'
import { ICategory } from '../DAO/documents/Category'
import dbConnect from '../utils/dbConnect'
import { findAllCategories } from '../business/CategoryManager'

export default function Home({
  categories,
}: {
  categories: ICategory[]
}): JSX.Element {
  return (
    <SiteWrapper headerType={'full'}>
      <CategoryList title='Wybrane kategorie' categories={categories} />
    </SiteWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categories: ICategory[] = []
  try {
    await dbConnect()
    const foundCategories = await findAllCategories(true)
    foundCategories.applyOnRight((cats) => {
      categories = cats.slice(0, 3)
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
