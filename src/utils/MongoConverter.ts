import { CarMakeDocument, ICarMake } from '../DAO/documents/CarMake'
import { ICategory, CategoryDocument } from '../DAO/documents/Category'

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
