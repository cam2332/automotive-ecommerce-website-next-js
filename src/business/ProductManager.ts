import { IProduct } from '../DAO/documents/Product'
import { ResultData } from '../DAO/types/ResultData'
import Product from '../DAO/models/Product'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromProductDocument } from '../utils/MongoConverter'
import SortMethod from '../DAO/types/SortMethod'
import IProductCriteria from '../DAO/types/IProductCriteria'

export const findProductById = async (
  productId: string
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
    const product = await Product.findById(productId)

    if (product) {
      return right(fromProductDocument(product))
    }
    return left(
      ApplicationError.RESOURCE_NOT_FOUND.setDetail(
        'Product not found.'
      ).setInstance('/products/:id')
    )
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

export const findAll = async (
  criteria: IProductCriteria
): Promise<ResultData<IProduct[]>> => {
  try {
    const productsDocs = await Product.findAll(criteria)
    const result = {
      ...productsDocs,
      results: productsDocs.results.map((product) =>
        fromProductDocument(product)
      ),
    }

    return result
  } catch (error) {
    return {
      totalPages: 1,
      totalResults: 0,
      results: [],
    }
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
