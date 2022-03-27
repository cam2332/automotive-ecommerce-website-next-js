import ICategoryCriteria from './ICategoryCriteria'
import IPageable from './IPageable'
import ISortCriteria from './ISortCriteria'

export default class CategoryCriteriaBuilder {
  private sort: ISortCriteria = undefined

  private name: string = undefined

  private pagination: IPageable = undefined

  public build(): ICategoryCriteria {
    return {
      sort: this.sort,
      name: this.name,
      pagination: this.pagination,
    }
  }

  public withSort(value: ISortCriteria): this {
    this.sort = value
    return this
  }

  public withName(value: string): this {
    this.name = value
    return this
  }

  public withPagination(value: IPageable): this {
    this.pagination = value
    return this
  }
}
