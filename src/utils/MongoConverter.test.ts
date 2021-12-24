/* eslint-disable no-return-await */
/* eslint-disable no-undef */
import { Types } from 'mongoose'
import {
  fromCategoryDocument,
  createDataTree,
  fromCarMakeDocument,
} from './MongoConverter'
import * as InMemoryMongo from './InMemoryMongo'
import Category from '../DAO/models/Category'
import CarMake from '../DAO/models/CarMake'

describe('Mongo converter', () => {
  beforeAll(async () => await InMemoryMongo.connect())

  afterAll(async () => await InMemoryMongo.closeDatabase())

  it('should convert car make document to object', () => {
    const id = Types.ObjectId().toHexString()
    const carMakeName = 'Audi'
    const make = new CarMake({
      _id: id,
      name: carMakeName,
    })
    const convertedMake = fromCarMakeDocument(make)

    expect(convertedMake.id).toEqual(id)
    expect(convertedMake.name).toEqual(carMakeName)
  })

  it('should convert category document to object', () => {
    const id = Types.ObjectId().toHexString()
    const categoryName = 'Category'
    const category = new Category({
      _id: id,
      name: categoryName,
      numberOfProducts: 0,
    })
    const convertedCategory = fromCategoryDocument(category)

    expect(convertedCategory.id).toEqual(id)
    expect(convertedCategory.name).toEqual(categoryName)
    expect(convertedCategory.numberOfProducts).toEqual(0)
  })

  it('should convert an array to tree', async () => {
    const inserted = await Category.insertMany([
      {
        _id: '60ff3bcb08a6931e6ccb99f7',
        name: 'Filtry',
        numberOfProducts: '0',
        thumbnailUrl: 'https://i.ibb.co/DrjrJPj/filtr-category.webp',
      },
      {
        _id: '61002bc203434d31ef41670b',
        name: 'Opony i felgi',
        numberOfProducts: '0',
      },
      {
        _id: '61002bc203434d31ef41670c',
        name: 'Czujniki ciśnienia',
        parentCategoryId: '61002bc203434d31ef41670b',
        numberOfProducts: '0',
      },
      {
        _id: '61002bc203434d31ef41670d',
        name: 'Dystanse kół',
        parentCategoryId: '61002bc203434d31ef41670b',
        numberOfProducts: '0',
      },
    ])
    const createdCategories = createDataTree(
      inserted.map((category) => fromCategoryDocument(category)),
      'id',
      'parentCategoryId'
    )

    const expectedCategoryTree = [
      {
        id: '60ff3bcb08a6931e6ccb99f7',
        name: 'Filtry',
        numberOfProducts: 0,
        parentCategoryId: null,
        thumbnailUrl: 'https://i.ibb.co/DrjrJPj/filtr-category.webp',
        categories: [],
      },
      {
        id: '61002bc203434d31ef41670b',
        name: 'Opony i felgi',
        numberOfProducts: 0,
        parentCategoryId: null,
        thumbnailUrl: null,
        categories: [
          {
            id: '61002bc203434d31ef41670c',
            name: 'Czujniki ciśnienia',
            numberOfProducts: 0,
            parentCategoryId: '61002bc203434d31ef41670b',
            thumbnailUrl: null,
            categories: [],
          },
          {
            id: '61002bc203434d31ef41670d',
            name: 'Dystanse kół',
            numberOfProducts: 0,
            parentCategoryId: '61002bc203434d31ef41670b',
            thumbnailUrl: null,
            categories: [],
          },
        ],
      },
    ]

    expect(createdCategories).toEqual(expectedCategoryTree)
  })
})
