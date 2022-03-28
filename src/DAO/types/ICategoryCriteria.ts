import IPageable from './IPageable'
import ISortCriteria from './ISortCriteria'

export default interface ICategoryCriteria {
  sort: ISortCriteria
  name: string
  pagination: IPageable
  flat: boolean
}
