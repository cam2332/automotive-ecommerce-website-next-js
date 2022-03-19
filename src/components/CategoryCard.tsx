/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image'
import Link from 'next/link'
import { ICategory } from '../DAO/documents/Category'

interface CategoryCardProps extends ICategory {
  maxNumberOfSubCategoriesVisible: number
}

function CategoryCard({
  id,
  name,
  categories,
  thumbnailUrl,
  maxNumberOfSubCategoriesVisible,
}: CategoryCardProps) {
  return (
    <div className='flex flex-col items-center p-4 md:p-6'>
      <div className='flex flex-row items-center justify-between w-full space-x-1 cursor-pointer hover:underline'>
        <div className='grid w-24 h-24'>
          {thumbnailUrl && (
            <Image
              width={160}
              height={160}
              layout='responsive'
              src={thumbnailUrl}
              alt={name}
            />
          )}
        </div>
        <Link href={`/category/${id}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className='flex pr-3 text-lg font-medium text-right truncate whitespace-normal text-primary-color max-w-full-96px'>
            {name}
          </a>
        </Link>
      </div>
      <div className='flex flex-col w-full p-4'>
        <ul className='space-y-2'>
          {categories &&
            categories
              .slice(0, maxNumberOfSubCategoriesVisible)
              .map(({ id, name, numberOfProducts }) => (
                <li key={id} className='flex flex-row items-center'>
                  <div className='flex flex-row justify-between w-full space-x-3 cursor-pointer hover:underline'>
                    <Link href={`/category/${id}`}>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <a className='text-sm font-semibold truncate whitespace-normal max-w-160px text-primary-color'>
                        {name}
                      </a>
                    </Link>
                    <span className='text-sm font-semibold text-gray-400'>
                      {numberOfProducts}
                    </span>
                  </div>
                </li>
              ))}
          {categories &&
            categories.length > 2 &&
            maxNumberOfSubCategoriesVisible < categories.length && (
              <li>
                <span>...</span>
              </li>
            )}
        </ul>
      </div>
    </div>
  )
}

export default CategoryCard
