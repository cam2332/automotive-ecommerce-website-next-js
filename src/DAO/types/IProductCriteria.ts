import IPageable from './IPageable'
import ISortCriteria from './ISortCriteria'

export default interface IProductCriteria {
  sort: ISortCriteria
  pagination: IPageable
  title: string
  categoriesIds: string[]
  ids: string[]
}
