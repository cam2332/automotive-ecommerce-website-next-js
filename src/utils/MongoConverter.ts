import { CarMakeDocument, ICarMake } from '../DAO/documents/CarMake'
import { ICategory, CategoryDocument } from '../DAO/documents/Category'
import { IProduct, ProductDocument } from '../DAO/documents/Product'
import { IUser, UserDocument } from '../DAO/documents/User'

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
    (aData) =>
      (hashTable[aData[id]] = {
        ...aData,
        categories: [],
        numberOfProducts: aData.numberOfProducts || 0,
      })
  )
  const dataTree: ICategory[] = []
  dataset.forEach((aData) => {
    if (aData[parentId] && hashTable[aData[parentId]]) {
      hashTable[aData[parentId]].categories.push(hashTable[aData[id]])
      hashTable[aData[parentId]].numberOfProducts +=
        hashTable[aData[id]].numberOfProducts
    } else {
      dataTree.push(hashTable[aData[id]])
    }
  })

  dataTree.forEach((aData) => {
    aData.numberOfProducts = aData.categories.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.numberOfProducts
      },
      0
    )
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

export const fromUserDocument = (user: UserDocument): IUser => {
  return {
    id: user._id || user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }
}
