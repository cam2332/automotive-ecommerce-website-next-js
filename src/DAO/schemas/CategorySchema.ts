import { Schema, Types } from 'mongoose'
import { CategoryDocument } from '../documents/Category'
import Category from '../models/Category'

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
  let categories = await Category.find(
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
