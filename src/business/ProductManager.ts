import { IProduct } from '../DAO/documents/Product'
import { ResultData } from '../DAO/types/ResultData'
import Product from '../DAO/models/Product'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromProductDocument } from '../utils/MongoConverter'
import SortMethod from '../DAO/types/SortMethod'

export const findProductById = async (
  productId: string,
  userId?: string
  // eslint-disable-next-line consistent-return
): Promise<Either<ApplicationError, IProduct>> => {
  if (productId === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
        `The 'id' URL parameter must be provided in the request.`
      ).setInstance('/products/:id')
    )
  }
  if (typeof productId !== 'string' || productId.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PATH_PARAMETER.setDetail(
        `The 'id' path parameter must be a string.`
      ).setInstance('/products/:id')
    )
  }

  try {
    const product = await Product.findProductById(productId, userId)

    if (product) {
      return right(fromProductDocument(product))
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find products with id ${productId}.`
      ).setInstance(`/products/:id`)
    )
  }
}

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

export const findProductsByIds = async (
  ids: string[],
  userId: string | undefined,
  page: number,
  resultsPerPage: number,
  sortMethod: SortMethod
): Promise<Either<ApplicationError, ResultData<IProduct[]>>> => {
  try {
    const products = await Product.findProductsByIds(
      ids,
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
        `Cannot find products with ids ${ids.toString()}.`
      ).setInstance('/products')
    )
  }
}
