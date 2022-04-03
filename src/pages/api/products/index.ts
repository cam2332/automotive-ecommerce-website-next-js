import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect'
import { findAll } from '../../../business/ProductManager'
import ApplicationError from '../../../utils/ApplicationError'
import ProductCriteriaBuilder from '../../../DAO/types/ProductCriteriaBuilder'
import PageableBuilder from '../../../DAO/types/PageableBuilder'
import SortCriteriaBuilder from '../../../DAO/types/SortCriteriaBuilder'

// TODO: get user from DB using auth cookie from request
export default async function handler(
  { method, query }: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
  } catch (err) {
    const error = ApplicationError.INTERNAL_ERROR.setDetail(
      'The server is currently unable to complete the request.'
    ).setInstance('/products')

    res.status(error.status).json(error.toObject())
  }

  switch (method) {
    case 'GET':
      try {
        const products = await findAll(
          new ProductCriteriaBuilder()
            .withTitle(query.title as string)
            .withIds(
              query.ids &&
                (Array.isArray(query.ids)
                  ? query.ids.filter((id) => id.length > 0)
                  : query.ids.split(',').filter((id) => id.length > 0))
            )
            .withCategoriesIds(
              query.categoriesIds &&
                (Array.isArray(query.categoriesIds)
                  ? query.categoriesIds.filter((id) => id.length > 0)
                  : query.categoriesIds
                      .split(',')
                      .filter((id) => id.length > 0))
            )
            .withPagination(
              new PageableBuilder()
                .withPage(parseInt(query.page as string, 10) || 1)
                .withSize(parseInt(query.size as string, 10) || 10)
                .build()
            )
            .withSort(
              new SortCriteriaBuilder()
                .withOrder(query['sort.order'] as string)
                .withAttribute((query['sort.attribute'] as string) || 'name')
                .build()
            )
            .build()
        )
        res.status(200).json(products)
      } catch (err) {
        const error = ApplicationError.INTERNAL_ERROR.setDetail(
          'Cannot find products.'
        ).setInstance('/products')

        res.status(error.status).json(error.toObject())
      }
      break
    default:
      const error = ApplicationError.METHOD_NOT_ALLOWED.setDetail(
        `The '${method}' method is not supported.`
      ).setInstance('/products')

      res.status(error.status).json(error.toObject())
      break
  }
}
