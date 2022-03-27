export type Direction = 'ASC' | 'DESC'

export default interface ISortCriteria {
  order: Direction
  attribute: string
}
