import { createUltimatePagination } from 'react-ultimate-pagination'
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from 'react-icons/hi'
import tw from 'tailwind-styled-components'

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page?: number
  totalPages?: number
  onChange: (page: number) => void
}): JSX.Element {
  const UltimatePagination = createUltimatePagination({
    itemTypeToComponent: itemTypeToComponent,
    WrapperComponent: Wrapper,
  })

  return (
    <UltimatePagination
      currentPage={page || 0}
      totalPages={totalPages || 0}
      onChange={(newPage: number) => onChange(newPage)}
    />
  )
}

export default Pagination

function Page(props: any) {
  return (
    <ItemWrapper
      className={`
      ${
        props.isActive &&
        'text-lg font-bold text-[#06202A] bg-white hover:bg-white'
      }`}
      onClick={props.onClick}
      $disabled={props.disabled}>
      {props.value}
    </ItemWrapper>
  )
}

function Ellipsis(props: any) {
  return (
    <ItemWrapper onClick={props.onClick} $disabled={props.disabled}>
      ...
    </ItemWrapper>
  )
}

function FirstPageLink(props: any) {
  return (
    <ItemWrapper onClick={props.onClick} $disabled={props.disabled}>
      <HiOutlineChevronDoubleLeft className='text-lg text-gray-600' />
    </ItemWrapper>
  )
}

function PreviousPageLink(props: any) {
  return (
    <ItemWrapper onClick={props.onClick} $disabled={props.disabled}>
      <HiOutlineChevronLeft className='text-lg text-gray-600' />
    </ItemWrapper>
    // <button
    //   className={'pagination-button'}
    //   onClick={props.onClick}
    //   disabled={props.disabled}>
    //   <HiChevronLeft
    //     className='text-lg text-gray-600'
    //   />
    // </button>
  )
}

function NextPageLink(props: any) {
  return (
    <ItemWrapper onClick={props.onClick} $disabled={props.disabled}>
      <HiOutlineChevronRight className='text-lg text-gray-600' />
    </ItemWrapper>
    // <button
    //   className={'pagination-button'}
    //   onClick={props.onClick}
    //   disabled={props.disabled}>
    //   <HiChevronRight className='h-5' />
    // </button>
  )
}

function LastPageLink(props: any) {
  return (
    <ItemWrapper onClick={props.onClick} $disabled={props.disabled}>
      <HiOutlineChevronDoubleRight className='text-lg text-gray-600' />
    </ItemWrapper>
  )
}

function Wrapper(props: any) {
  return <div className='flex'>{props.children}</div>
}

const itemTypeToComponent = {
  PAGE: Page,
  ELLIPSIS: Ellipsis,
  FIRST_PAGE_LINK: FirstPageLink,
  PREVIOUS_PAGE_LINK: PreviousPageLink,
  NEXT_PAGE_LINK: NextPageLink,
  LAST_PAGE_LINK: LastPageLink,
}

const ItemWrapper = tw.div`
  h-11
  w-11
  rounded-full
  flex
  items-center
  justify-center
  hover:bg-gray-100
  ${({ $disabled }: { $disabled: boolean }) => !$disabled && 'cursor-pointer'}
`
