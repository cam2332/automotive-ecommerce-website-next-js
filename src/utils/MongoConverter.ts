import { CarMakeDocument, ICarMake } from '../DAO/documents/CarMake'
import { ICategory, CategoryDocument } from '../DAO/documents/Category'
import { IProduct, ProductDocument } from '../DAO/documents/Product'

export const fromCarMakeDocument = (carMake: CarMakeDocument): ICarMake => {
  return {
    id: carMake._id || carMake.id,
    name: carMake.name,
  }
}

export const fromCategoryDocument = (category: CategoryDocument): ICategory => {
  return {
    id: category._id || category.id,
    name: category.name,
    numberOfProducts: category.numberOfProducts || 0,
    parentCategoryId: category.parentCategoryId || null,
    thumbnailUrl: category.thumbnailUrl || null,
  }
}

export const createDataTree = (dataset, id: string, parentId: string) => {
  const hashTable = Object.create(null)
  dataset.forEach(
    (aData) => (hashTable[aData[id]] = { ...aData, categories: [] })
  )
  const dataTree = []
  dataset.forEach((aData) => {
    if (aData[parentId] && hashTable[aData[parentId]]) {
      hashTable[aData[parentId]].categories.push(hashTable[aData[id]])
    } else {
      dataTree.push(hashTable[aData[id]])
    }
  })
  return dataTree
}

export const fromProductDocument = (product: ProductDocument): IProduct => {
  return {
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
  }
}
