import { useState } from 'react'
import useSWR from 'swr'
import tw from 'tailwind-styled-components'
import { useAppContext } from '../context/AppContext'
import VehicleFilterSelect from './select/VehicleFilterSelect'

const fetcher = (url) => fetch(url).then((res) => res.json())

const useCarMakes = (): {
  makes: any[]
  isLoading: boolean
  isError: boolean
} => {
  const { data, error } = useSWR('/api/cars/makes', fetcher)

  return {
    makes: data?.map(({ id, name }) => {
      return { id, value: name }
    }),
    isLoading: !error && !data,
    isError: error,
  }
}

const useCarModels = (
  makeId: string
): { models: any[]; isLoading: boolean; isError: boolean } => {
  const { data, error } = useSWR(
    makeId !== '' ? `/api/cars/models?makeId=${makeId}` : '',
    fetcher
  )

  return {
    models:
      data?.data?.map(
        ({ id, group, name, productionStartYear, productionEndYear }) => {
          return {
            id,
            value: `${group} ${name} (${productionStartYear} - ${productionEndYear})`,
            group: group,
          }
        }
      ) || [],
    isLoading: !error && !data,
    isError: error,
  }
}

const useCarTypes = (
  makeId: string,
  modelId: string
): { types: any[]; isLoading: boolean; isError: boolean } => {
  const { data, error } = useSWR(
    makeId !== '' && modelId !== '' ? `/api/cars/types?modelId=${modelId}` : '',
    fetcher
  )

  return {
    types:
      data?.data
        ?.sort((a, b) => {
          if (a.group < b.group) return 1
          if (a.group > b.group) return -1
          return 0
        })
        .map(
          ({
            id,
            group,
            engineDisplacement,
            type,
            kW,
            KM,
            productionStartYear,
            productionEndYear,
          }) => {
            return {
              id,
              value: `${engineDisplacement} ${type} ${kW}kW ${KM}KM (${productionStartYear} - ${productionEndYear})`,
              group: group,
            }
          }
        ) || [],
    isLoading: !error && !data,
    isError: error,
  }
}

function VehicleFilter() {
  const appContext = useAppContext()
  const [selectedCarMake, setSelectedCarMake] = useState<{
    id: string
    value: string
  }>({ id: '', value: '' })
  const [selectedCarModel, setSelectedCarModel] = useState<{
    id: string
    value: string
  }>({ id: '', value: '' })
  const [selectedCarType, setSelectedCarType] = useState<{
    id: string
    value: string
  }>({ id: '', value: '' })
  const { makes, isLoading: makesLoading, isError: makesError } = useCarMakes()
  const {
    models,
    isLoading: modelsLoading,
    isError: modelsError,
  } = useCarModels(selectedCarMake.id)
  const {
    types,
    isLoading: typesLoading,
    isError: typesError,
  } = useCarTypes(selectedCarMake.id, selectedCarModel.id)

  return (
    <Container>
      <TitleWrapper>
        <TitleText>Wybierz samochód</TitleText>
      </TitleWrapper>
      <FieldsContainer>
        <VehicleFilterSelect
          value={selectedCarMake.value}
          options={makesLoading || makesError ? [] : makes}
          onClickItem={(item) => setSelectedCarMake(item)}
          inputPlaceholder={'Marka'}
          onClickField={() => {
            setSelectedCarMake({ id: '', value: '' })
            setSelectedCarModel({ id: '', value: '' })
            setSelectedCarType({ id: '', value: '' })
          }}
          active={true}
        />
        <VehicleFilterSelect
          value={selectedCarModel.value}
          options={modelsLoading || modelsError ? [] : models}
          groupBy={'group'}
          onClickItem={(item) => setSelectedCarModel(item)}
          inputPlaceholder={'Model'}
          onClickField={() => {
            setSelectedCarModel({ id: '', value: '' })
            setSelectedCarType({ id: '', value: '' })
          }}
          active={selectedCarMake.id !== ''}
        />
        <VehicleFilterSelect
          value={selectedCarType.value}
          options={typesLoading || typesError ? [] : types}
          groupBy={'group'}
          onClickItem={(item) => setSelectedCarType(item)}
          inputPlaceholder={'Typ'}
          onClickField={() => setSelectedCarType({ id: '', value: '' })}
          active={selectedCarModel.id !== ''}
        />
        {/* <SearchButton>SZUKAJ</SearchButton> */}
      </FieldsContainer>
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-col
  items-center
  w-full
  pt-3
  pb-6
  space-y-5
  bg-gray-200
  
  lg:w-5xl
  lg:max-w-5xl
`

const TitleWrapper = tw.div`
  flex
  flex-col
  w-full
  justify-self-start
  px-4
`

const TitleText = tw.span`
  font-semibold
  text-primary-color
`

const FieldsContainer = tw.div`
  flex
  flex-col
  items-center
  w-full
  space-y-5
  px-4

  md:space-y-0
  md:flex-row
  md:space-x-3
`

const SearchButton = tw.button`
  flex
  flex-col
  items-center
  w-full
  font-semibold
  rounded-full
  bg-secondary-color
  py-2px
  text-body-color
`

export default VehicleFilter
