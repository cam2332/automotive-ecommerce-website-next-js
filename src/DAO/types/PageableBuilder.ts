import IPageable from './IPageable'

export default class PageableBuilder {
  private page: number = 1

  private size: number = 10

  public build(): IPageable {
    return {
      page: this.page,
      size: this.size,
    }
  }

  public withPage(value: number): this {
    this.page = value
    return this
  }

  public withSize(value: number): this {
    this.size = value
    return this
  }
}
