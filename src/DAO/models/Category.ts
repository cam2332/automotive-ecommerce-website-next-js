import { Model, model } from 'mongoose'
import { CategoryDocument } from '../documents/Category'
import CategorySchema from '../schemas/CategorySchema'

export interface CategoryModel extends Model<CategoryDocument> {
  createCategory(
    name: string,
    thumbnailUrl?: string,
    parentCategoryId?: string
  ): Promise<CategoryDocument>
  findAllCategories(): Promise<CategoryDocument[]>
  findCategoryById(id: string): Promise<CategoryDocument | null>
  findCategoryByName(name: string): Promise<CategoryDocument | null>
}

let category: CategoryModel
try {
  category = model('Categories') as CategoryModel
} catch {
  category = model<CategoryDocument, CategoryModel>(
    'Categories',
    CategorySchema,
    'Categories'
  )
}

export default category
