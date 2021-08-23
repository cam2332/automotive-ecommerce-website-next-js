import tw from 'tailwind-styled-components'
import { ICategory } from '../DAO/documents/Category'
import CategoryItem from './select/CategoryItem'
import ParentCategoryItem from './select/ParentCategoryItem'

export interface CategoryNavProps extends ICategory {
  selectedCategoryId: string
  heightClass?: string
  onClickNewCategory: (categoryId: string) => void
}

function CategoryNav(props: CategoryNavProps) {
  const categoryTree = (category: ICategory, root: boolean, level: number) => (
    <ul key={category.id + level}>
      {root ? (
        <ParentCategoryItem
          key={category.id}
          name={category.name}
          value={
            category.numberOfProducts
              ? category.numberOfProducts.toString()
              : ' '
          }
          selected={category.id === props.selectedCategoryId}
          onClick={() =>
            !(category.id === props.selectedCategoryId) &&
            props.onClickNewCategory(category.id)
          }
        />
      ) : (
        <CategoryItem
          key={category.id + category.name}
          name={category.name}
          value={
            category.numberOfProducts
              ? category.numberOfProducts.toString()
              : ' '
          }
          selected={category.id === props.selectedCategoryId}
          level={level}
          onClick={() =>
            !(category.id === props.selectedCategoryId) &&
            props.onClickNewCategory(category.id)
          }
        />
      )}
      {category.categories &&
        category.categories.map((subCategory) =>
          subCategory.categories && subCategory.categories.length > 0 ? (
            categoryTree(subCategory, false, level + 1)
          ) : (
            <CategoryItem
              key={subCategory.id}
              name={subCategory.name}
              value={
                subCategory.numberOfProducts
                  ? subCategory.numberOfProducts.toString()
                  : ' '
              }
              selected={subCategory.id === props.selectedCategoryId}
              level={level + 1}
              onClick={() =>
                !(subCategory.id === props.selectedCategoryId) &&
                props.onClickNewCategory(subCategory.id)
              }
            />
          )
        )}
    </ul>
  )

  return (
    <MainContainer>
      <ListContainer $heightClass={props.heightClass}>
        {categoryTree(props, true, 0)}
      </ListContainer>
    </MainContainer>
  )
}

const MainContainer = tw.div`
  flex
  flex-col
  items-start
  h-full
  w-full
  py-2
  min-w-250px
`

const ListContainer = tw.ul`
  flex
  flex-col
  w-full
  ${({ $heightClass }: { $heightClass: string }) => $heightClass || 'h-full'}
  overflow-y-auto
  thin-scrollbar
`

export default CategoryNav
