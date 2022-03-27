import { Model, model } from 'mongoose'
import { CategoryDocument } from '../documents/Category'
// eslint-disable-next-line import/no-cycle
import CategorySchema from '../schemas/CategorySchema'
import { ResultData } from '../types/ResultData'
import SortMethod from '../types/SortMethod'

export interface CategoryModel extends Model<CategoryDocument> {
  createCategory(
    name: string,
    thumbnailUrl?: string,
    parentCategoryId?: string
  ): Promise<CategoryDocument>
  findAll(): Promise<CategoryDocument[]>
  findCategoryById(id: string): Promise<CategoryDocument | null>
  findCategoryByName(name: string): Promise<CategoryDocument | null>
  findAllByName(
    name: string,
    page: number,
    resultsPerPage: number,
    sortMethod: SortMethod
  ): Promise<ResultData<CategoryDocument[]>>
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
