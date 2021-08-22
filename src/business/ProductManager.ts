import { IProduct } from '../DAO/documents/Product'
import { ResultData } from '../DAO/types/ResultData'
import Product from '../DAO/models/Product'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromProductDocument } from '../utils/MongoConverter'
import SortMethod from '../DAO/types/SortMethod'

export const findProductsByCategoryId = async (
  userId: string | undefined,
  categoryId: string
): Promise<Either<ApplicationError, IProduct[]>> => {
  try {
    const products = await Product.findProductsByCategoryId(userId, categoryId)
    return right(products.map((product) => fromProductDocument(product)))
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find products with category id ${categoryId}.`
      ).setInstance(`/products`)
    )
  }
}

export const findProductsByCategoryHierarchy = async (
  categoryId: string,
  userId: string | undefined,
  page: number,
  resultsPerPage: number,
  sortMethod: SortMethod
): Promise<Either<ApplicationError, ResultData<IProduct[]>>> => {
  try {
    const products = await Product.findProductsByCategoryHierarchy(
      categoryId,
      userId,
      page,
      resultsPerPage,
      sortMethod
    )
    return right({
      ...products,
      results: products.results.map((product) => fromProductDocument(product)),
    })
  } catch (error) {
    console.log(error)
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find products with category id ${categoryId}.`
      ).setInstance(`/products`)
    )
  }
}
