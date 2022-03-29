import IPageable from './IPageable'
import IProductCriteria from './IProductCriteria'
import ISortCriteria from './ISortCriteria'

export default class ProductCriteriaBuilder {
  private sort: ISortCriteria = undefined

  private pagination: IPageable = undefined

  private title: string = undefined

  private categoriesIds: string[] = undefined

  public build(): IProductCriteria {
    return {
      sort: this.sort,
      pagination: this.pagination,
      title: this.title,
      categoriesIds: this.categoriesIds,
    }
  }

  public withSort(value: ISortCriteria): this {
    this.sort = value
    return this
  }

  public withPagination(value: IPageable): this {
    this.pagination = value
    return this
  }

  public withTitle(value: string): this {
    this.title = value
    return this
  }

  public withCategoriesIds(value: string[]): this {
    this.categoriesIds = value
    return this
  }
}
