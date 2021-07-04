import { IoChevronDownSharp } from 'react-icons/io5'
import { useAppContext } from '../context/AppContext'

function VehicleFilter() {
  const appContext = useAppContext()

  return (
    <div className='flex flex-col items-center w-full pt-3 pb-6 space-y-5 bg-gray-200'>
      <div className='flex flex-col w-90% justify-self-start md:w-full md:px-4'>
        <span className='font-semibold text-primary-color'>
          Wybierz samochód
        </span>
      </div>
      <div className='flex flex-col items-center w-full space-y-5 md:space-y-0 md:flex-row md:space-x-3 md:px-4'>
        <div className='flex flex-row items-center w-90% border-2 rounded-full bg-white py-2px'>
          <select
            className='ml-3 mr-1 w-90% text-primary-color appearance-none bg-white'
            value={appContext.selectedCarMake}
            onChange={(e) => appContext.setSelectedCarMake(e.target.value)}>
            <option value='' disabled selected hidden>
              Wybierz markę
            </option>
          </select>
          <IoChevronDownSharp className='my-2 ml-1 mr-3 text-sm cursor-pointer text-secondary-color' />
        </div>
        <div className='flex flex-row items-center w-90% border-2 rounded-full bg-white py-2px'>
          <select
            className='ml-3 mr-1 w-90% text-primary-color appearance-none bg-white'
            value={appContext.selectedCarModel}
            onChange={(e) => appContext.setSelectedCarModel(e.target.value)}>
            <option value='' disabled selected hidden>
              Wybierz model
            </option>
          </select>
          <IoChevronDownSharp className='my-2 ml-1 mr-3 text-sm cursor-pointer text-secondary-color' />
        </div>
        <div className='flex flex-row items-center w-90% border-2 rounded-full bg-white py-2px'>
          <select
            className='ml-3 mr-1 w-90% text-primary-color appearance-none bg-white'
            value={appContext.selectedCarType}
            onChange={(e) => appContext.setSelectedCarType(e.target.value)}>
            <option value='' disabled selected hidden>
              Wybierz typ
            </option>
          </select>
          <IoChevronDownSharp className='my-2 ml-1 mr-3 text-sm cursor-pointer text-secondary-color' />
        </div>
        <div className='flex flex-col items-center w-90% border-2 border-secondary-color rounded-full bg-secondary-color py-2px'>
          <button className='font-semibold text-body-color'>SZUKAJ</button>
        </div>
      </div>
    </div>
  )
}

export default VehicleFilter
