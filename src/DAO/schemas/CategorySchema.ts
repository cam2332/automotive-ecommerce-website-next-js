import { Schema, Types } from 'mongoose'
import { CategoryDocument } from '../documents/Category'
// eslint-disable-next-line import/no-cycle
import Category from '../models/Category'
import SortMethod from '../types/SortMethod'
import { ResultData } from '../types/ResultData'

const CategorySchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    numberOfProducts: { type: Schema.Types.Number, required: true },
    thumbnailUrl: { type: Schema.Types.String },
    parentCategoryId: { type: Schema.Types.String, ref: 'Categories' },
    categories: [{ type: Schema.Types.String, ref: 'Categories' }],
  },
  {
    collection: 'Categories',
  }
)

export default CategorySchema

CategorySchema.statics.createCategory = async (
  name: string,
  thumbnailUrl?: string,
  parentCategoryId?: string
): Promise<CategoryDocument> => {
  const category = new Category({
    _id: Types.ObjectId().toHexString(),
    name: name,
    numberOfProducts: 0,
    ...(thumbnailUrl && { thumbnailUrl: thumbnailUrl }),
    ...(parentCategoryId && { parentCategoryId: parentCategoryId }),
  })
  const createdCategory = await category.save()
  return createdCategory
}

CategorySchema.statics.findAllCategories = async (): Promise<
  CategoryDocument[]
> => {
  const categories = await Category.find(
    {},
    {
      name: 1,
      numberOfProducts: 1,
      thumbnailUrl: 1,
      parentCategoryId: 1,
      categories: 1,
    }
  ).sort({ name: 1 })

  return categories
}

CategorySchema.statics.findCategoryByName = async (
  name: string
): Promise<CategoryDocument | null> => {
  const category = await Category.findOne({
    name: new RegExp('.*' + name + '.*', 'i'),
  })

  return category
}

CategorySchema.statics.findCategoryById = async (
  id: string
): Promise<CategoryDocument | null> => {
  const category = await Category.findById(id)

  return category
}

CategorySchema.statics.findAllByName = async (
  name: string,
  page: number,
  resultsPerPage: number,
  sortMethod: SortMethod
): Promise<ResultData<CategoryDocument[]>> => {
  const pipeline = []
  pipeline.push({
    $match: {
      name: {
        $regex: new RegExp(name, 'i'),
      },
    },
  })

  const sort = {
    $sort: {
      ...(sortMethod.type === SortMethod.relevance.type && { _id: -1 }),
      ...(sortMethod.type === SortMethod.nameAsc.type && { title: 1 }),
      ...(sortMethod.type === SortMethod.nameDesc.type && { title: -1 }),
      ...(sortMethod.type === SortMethod.priceAsc.type && { price: 1 }),
      ...(sortMethod.type === SortMethod.priceDesc.type && { price: -1 }),
    },
  }
  pipeline.push(sort)

  const pagination = {
    $facet: {
      metadata: [
        {
          $count: 'totalResults',
        },
        {
          $addFields: {
            totalPages: {
              $ceil: {
                $divide: ['$totalResults', resultsPerPage],
              },
            },
          },
        },
      ],
      results: [
        {
          $skip: (page - 1) * resultsPerPage,
        },
        {
          $limit: resultsPerPage,
        },
      ],
    },
  }
  pipeline.push(pagination)

  const categories = await Category.aggregate(pipeline)

  return {
    totalPages: categories[0].metadata[0]
      ? categories[0].metadata[0].totalPages
      : 1,
    totalResults: categories[0].metadata[0]
      ? categories[0].metadata[0].totalResults
      : 0,
    results: categories[0].results,
  }
}
