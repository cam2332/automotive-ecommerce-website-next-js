import { CarMakeDocument, ICarMake } from '../DAO/documents/CarMake'
import { CarModelDocument, ICarModel } from '../DAO/documents/CarModel'
import { CarTypeDocument, ICarType } from '../DAO/documents/CarType'
import { ICategory, CategoryDocument } from '../DAO/documents/Category'
import { IProduct, ProductDocument } from '../DAO/documents/Product'
import { IUser, UserDocument } from '../DAO/documents/User'
import ICategoryCriteria from '../DAO/types/ICategoryCriteria'

export const fromCarTypeDocument = (carType: CarTypeDocument): ICarType => ({
  id: carType._id || carType.id,
  group: carType.group,
  engineDisplacement: carType.engineDisplacement,
  type: carType.type,
  kW: carType.kW,
  HP: carType.HP,
  productionStartYear: carType.productionStartYear,
  productionEndYear: carType.productionEndYear,
})

export const fromCarModelDocument = (
  carModel: CarModelDocument
): ICarModel => ({
  id: carModel._id || carModel.id,
  group: carModel.group,
  name: carModel.name,
  productionStartYear: carModel.productionStartYear,
  productionEndYear: carModel.productionEndYear,
  makeId: carModel.makeId,
  types: carModel.types
    ? carModel.types.map((type) => fromCarTypeDocument(type))
    : [],
})

export const fromCarMakeDocument = (carMake: CarMakeDocument): ICarMake => ({
  id: carMake._id || carMake.id,
  name: carMake.name,
  models: carMake.models
    ? carMake.models.map((model) => fromCarModelDocument(model))
    : [],
})

export const fromCategoryDocument = (
  category: CategoryDocument
): ICategory => ({
  id: category._id || category.id,
  name: category.name,
  numberOfProducts: category.numberOfProducts || 0,
  parentCategoryId: category.parentCategoryId || null,
  thumbnailUrl: category.thumbnailUrl || null,
})

const compareCategory = (
  category1: ICategory,
  category2: ICategory,
  criteria: ICategoryCriteria
) => {
  if (criteria.sort.attribute === 'name') {
    if (criteria.sort.order === 'ASC') {
      return category1.name.localeCompare(category2.name)
    }
    return category2.name.localeCompare(category1.name)
  }
  if (criteria.sort.attribute === 'numberOfProducts') {
    if (criteria.sort.order === 'ASC') {
      return category1.numberOfProducts - category2.numberOfProducts
    }
    return category2.numberOfProducts - category1.numberOfProducts
  }
  if (criteria.sort.order === 'ASC') {
    return (
      category1[criteria.sort.attribute] - category2[criteria.sort.attribute]
    )
  }
  return category2[criteria.sort.attribute] - category1[criteria.sort.attribute]
}

export const createCategoryDataTree = (
  dataset: ICategory[],
  id: string,
  parentId: string,
  criteria: ICategoryCriteria
) => {
  const hashTable: { [key: string]: ICategory } = Object.create(null)
  dataset.forEach((aData: ICategory) => {
    hashTable[aData[id]] = {
      ...aData,
      categories: [],
      numberOfProducts: aData.numberOfProducts || 0,
    }
  })
  const dataTree: ICategory[] = []
  dataset.forEach((aData: ICategory) => {
    if (aData[parentId] && hashTable[aData[parentId]]) {
      hashTable[aData[parentId]].categories.push(hashTable[aData[id]])
      hashTable[aData[parentId]].numberOfProducts +=
        hashTable[aData[id]].numberOfProducts
    } else {
      dataTree.push(hashTable[aData[id]])
    }
  })

  dataTree.forEach((aData: ICategory) => {
    aData.numberOfProducts = aData.categories.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.numberOfProducts,
      0
    )
    if (aData.categories) {
      aData.categories.sort((category1, category2) =>
        compareCategory(category1, category2, criteria)
      )
    }
  })
  return dataTree
    .filter((category) => new RegExp(criteria.name, 'i').test(category.name))
    .slice(
      (criteria.pagination.page - 1) * criteria.pagination.size,
      (criteria.pagination.page - 1) * criteria.pagination.size +
        criteria.pagination.size
    )
    .sort((category1, category2) =>
      compareCategory(category1, category2, criteria)
    )
}

export const fromProductDocument = (product: ProductDocument): IProduct => ({
  id: product._id || product.id,
  title: product.title,
  subTitle: product.subTitle || null,
  identifier: product.identifier,
  price: product.price,
  oldPrice: product.oldPrice || null,
  currency: product.currency,
  quantity: product.quantity,
  properties: JSON.parse(JSON.stringify(product.properties)) || null,
  manufacturer: product.manufacturer,
  categoryId: product.categoryId,
  compatibleCarTypeIds: product.compatibleCarTypeIds || null,
  thumbnailUrl: product.thumbnailUrl || null,
  inWishList: product.inWishList || null,
})

export const fromUserDocument = (user: UserDocument): IUser => ({
  id: user._id || user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  cart:
    user.cart.map(({ productId, quantity }) => ({ productId, quantity })) || [],
  wishList: user.wishList.map((productId) => productId) || [],
})
