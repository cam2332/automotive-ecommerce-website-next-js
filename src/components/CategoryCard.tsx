/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image'
import { ICategory } from '../DAO/documents/Category'

interface CategoryCardProps extends ICategory {
  onClickMainCategory: () => void
  onClickSubCategory: (id: string, name: string) => void
  maxNumberOfSubCategoriesVisible: number
}

function CategoryCard({
  id,
  name,
  categories,
  thumbnailUrl,
  onClickMainCategory,
  onClickSubCategory,
  maxNumberOfSubCategoriesVisible,
}: CategoryCardProps) {
  return (
    <div className='flex flex-col items-center p-4 md:p-6'>
      <div
        className='flex flex-row items-center justify-between w-full space-x-1 cursor-pointer hover:underline'
        onClick={() => onClickMainCategory()}>
        <div className='grid w-24 h-24'>
          {thumbnailUrl && (
            <Image
              width={160}
              height={160}
              layout='responsive'
              src={thumbnailUrl}
            />
          )}
        </div>
        <span className='flex pr-3 text-lg font-medium text-right truncate whitespace-normal text-primary-color max-w-full-96px'>
          {name}
        </span>
      </div>
      <div className='flex flex-col w-full p-4'>
        <ul className='space-y-2'>
          {categories &&
            categories
              .slice(0, maxNumberOfSubCategoriesVisible)
              .map(({ id, name, numberOfProducts }) => (
                <li
                  key={id}
                  className='flex flex-row items-center'
                  onClick={() => onClickSubCategory(id, name)}>
                  <div className='flex flex-row justify-between w-full space-x-3 cursor-pointer hover:underline'>
                    <span className='text-sm font-semibold truncate whitespace-normal max-w-160px text-primary-color'>
                      {name}
                    </span>
                    <span className='text-sm font-semibold text-gray-400'>
                      {numberOfProducts}
                    </span>
                  </div>
                </li>
              ))}
          {categories &&
            categories.length > 2 &&
            maxNumberOfSubCategoriesVisible < categories.length && (
              <span>...</span>
            )}
        </ul>
      </div>
    </div>
  )
}

export default CategoryCard
