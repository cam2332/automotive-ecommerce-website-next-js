export default class SortMethod {
  constructor(public type: string, public value: string) {}

  public toString(): string {
    return this.value
  }

  static fromType(type: string): SortMethod | undefined {
    const index = SortMethod.types.indexOf(type)
    if (index >= 0) {
      return new SortMethod(type, SortMethod.values[index])
    } else {
      return undefined
    }
  }

  static relevance = new SortMethod('relevance', 'Trafność')
  static nameAsc = new SortMethod('nameAsc', 'Nazwa A-Ż')
  static nameDesc = new SortMethod('nameDesc', 'Nazwa Ż-A')
  static priceAsc = new SortMethod('priceAsc', 'Cena - rosnąco')
  static priceDesc = new SortMethod('priceDesc', 'Cena - malejąco')

  static types: string[] = [
    SortMethod.relevance.type,
    SortMethod.nameAsc.type,
    SortMethod.nameDesc.type,
    SortMethod.priceAsc.type,
    SortMethod.priceDesc.type,
  ]

  static values: string[] = [
    SortMethod.relevance.toString(),
    SortMethod.nameAsc.toString(),
    SortMethod.nameDesc.toString(),
    SortMethod.priceAsc.toString(),
    SortMethod.priceDesc.toString(),
  ]
}
