function Footer() {
  return (
    <footer>
      <div className='flex flex-col items-center justify-center w-full p-4 space-y-4 text-center bg-gray-100'>
        <div className='flex flex-row items-center space-x-3'>
          <a href='#' className='text-sm'>
            Kontakt
          </a>
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
