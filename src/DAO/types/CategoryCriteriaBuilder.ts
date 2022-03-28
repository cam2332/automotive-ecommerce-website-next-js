import ICategoryCriteria from './ICategoryCriteria'
import IPageable from './IPageable'
import ISortCriteria from './ISortCriteria'

export default class CategoryCriteriaBuilder {
  private sort: ISortCriteria = undefined

  private name: string = undefined

  private pagination: IPageable = undefined

  private flat: boolean = false

  public build(): ICategoryCriteria {
    return {
      sort: this.sort,
      name: this.name,
      pagination: this.pagination,
      flat: this.flat,
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

  /**
   * Set to true for flat list of categories instead of tree
   */
  public withFlat(value: boolean): this {
    this.flat = value
    return this
  }
}
