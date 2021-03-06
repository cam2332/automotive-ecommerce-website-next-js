import Link from 'next/link'
/* eslint-disable jsx-a11y/anchor-is-valid */
function Footer() {
  return (
    <footer>
      <div className='flex flex-col items-center justify-center w-full h-24 p-4 space-y-4 text-center bg-gray-100'>
        <div className='flex flex-row items-center space-x-3'>
          <Link key='contact' href='/contact'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className='text-sm'>Kontakt</a>
          </Link>
          <div className='w-px h-3 bg-primary-color' />
          <a href='#' className='text-sm'>
            Płatność
          </a>
          <div className='w-px h-3 bg-primary-color' />
          <a href='#' className='text-sm'>
            Zwrot towaru
          </a>
          <div className='w-px h-3 bg-primary-color' />
          <a href='#' className='text-sm'>
            Wymiana
          </a>
        </div>
        <p className='text-xs'>&#169; 2021 Auto części - sklep online</p>
      </div>
    </footer>
  )
}

export default Footer
