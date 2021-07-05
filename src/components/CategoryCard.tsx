import Image from 'next/image'

function CategoryCard({
  name,
  subCategories,
  thumbnailUrl,
}: {
  id: string
  name: string
  subCategories: { id: string; name: string; count: number }[]
  thumbnailUrl: string
}) {
  return (
    <div className='flex flex-col items-center p-4 md:p-6'>
      <div className='flex flex-row items-center space-x-3 cursor-pointer hover:underline'>
        <div className='grid p-2 w-28'>
          <Image
            width={100}
            height={100}
            layout='responsive'
            src={thumbnailUrl}
          />
        </div>
        <span className='text-lg font-medium text-center text-primary-color'>
          {name}
        </span>
      </div>
      <div className='flex flex-col p-4'>
        <ul className='space-y-2'>
          {subCategories.map(({ id, name, count }) => (
            <li key={id} className='flex flex-row items-center space-x-2'>
              <div className='flex flex-row space-x-3 cursor-pointer hover:underline'>
                <span className='text-sm font-semibold text-primary-color'>
                  {name}
                </span>
                <span className='text-sm font-semibold text-gray-400'>
                  {count}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategoryCard
