import { useRouter } from 'next/router'
import tw from 'tailwind-styled-components'
import { ICategory } from '../DAO/documents/Category'
import CategoryCard from './CategoryCard'

function CategoryList({
  title,
  categories,
}: {
  title: string
  categories: ICategory[]
}) {
  const router = useRouter()

  return (
    <MainContainer>
      <TitleText>
        {!categories || categories.length === 0 ? 'Brak kategorii' : title}
      </TitleText>
      <CategoriesGrid>
        {categories &&
          categories.length > 0 &&
          categories.map((category) => (
            <CategoryCard
              key={category.id + category.name}
              id={category.id}
              name={category.name}
              numberOfProducts={category.numberOfProducts}
              categories={category.categories}
              thumbnailUrl={category.thumbnailUrl}
              onClickMainCategory={() => {
                /** move to category page */
                router.push('/category/' + category.id)
              }}
              onClickSubCategory={(id, name) => {
                /** move to category page */
                router.push('/category/' + id)
              }}
              maxNumberOfSubCategoriesVisible={5}
            />
          ))}
      </CategoriesGrid>
    </MainContainer>
  )
}

const MainContainer = tw.div`
  flex
 	flex-col
 	items-center
 	w-full
`
const TitleText = tw.span`
  mt-8
 	text-2xl
 	text-center
`
const CategoriesGrid = tw.div`
  grid
 	w-full
 	sm:grid-cols-2
 	md:grid-cols-3
 	lg:grid-cols-3
 	lg:max-w-5xl
`
export default CategoryList
