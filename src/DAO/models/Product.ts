import { Model, model } from 'mongoose'
import { ProductDocument } from '../documents/Product'
import { ResultData } from '../types/ResultData'
// eslint-disable-next-line import/no-cycle
import ProductSchema from '../schemas/ProductSchema'
import SortMethod from '../types/SortMethod'

export interface ProductModel extends Model<ProductDocument> {
  createProduct(): Promise<ProductDocument>
  findProductById(id: string, userId?: string): Promise<ProductDocument | null>
  findAllProducts(userId?: string): Promise<ProductDocument[]>
  findProductsByCategoryId(
    userId?: string,
    categoryId?: string
  ): Promise<ProductDocument[]>
  findProductsByCategoryHierarchy(
    categoryId: string,
    userId: string | undefined,
    page: number,
    resultsPerPage: number,
    sortMethod: SortMethod
  ): Promise<ResultData<ProductDocument[]>>
  findProductsByIds(
    ids: string[],
    userId: string | undefined,
    page: number,
    resultsPerPage: number,
    sortMethod: SortMethod
  ): Promise<ResultData<ProductDocument[]>>
  findAllByTitle(
    title: string,
    page: number,
    resultsPerPage: number,
    sortMethod: SortMethod
  ): Promise<ResultData<ProductDocument[]>>
}

let product: ProductModel
try {
  product = model('Products') as ProductModel
} catch {
  product = model<ProductDocument, ProductModel>(
    'Products',
    ProductSchema,
    'Products'
  )
}

export default product
