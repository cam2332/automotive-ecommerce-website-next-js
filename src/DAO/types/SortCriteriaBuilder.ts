import ISortCriteria, { Direction } from './ISortCriteria'

export default class SortCriteriaBuilder {
  private order: Direction = undefined

  private attribute: string = undefined

  public build(): ISortCriteria {
    return {
      order: this.order,
      attribute: this.attribute,
    }
  }

  public withOrder(value: Direction | string): this {
    this.order = value !== 'ASC' && value !== 'DESC' ? 'ASC' : value
    return this
  }

  public withAttribute(value: string): this {
    this.attribute = value
    return this
  }
}
