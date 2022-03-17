import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect'
import {
  findProductsByIds,
  findAllByTitle,
} from '../../../business/ProductManager'
import SortMethod from '../../../DAO/types/SortMethod'
import ApplicationError from '../../../utils/ApplicationError'

// TODO: get user from DB using auth cookie from request
export default async function handler(
  {
    method,
    query: { title, ids, page, resultsPerPage, sortMethod },
  }: NextApiRequest,
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
        if (title) {
          const results = await findAllByTitle(
            title as string,
            parseInt(page as string, 10) || 1,
            parseInt(resultsPerPage as string, 10) || 999,
            SortMethod.fromType(sortMethod as string) || SortMethod.relevance
          )

          res.status(200).json(results)
        } else {
          const results = await findProductsByIds(
            Array.isArray(ids)
              ? ids.filter((id) => id.length > 0)
              : ids.split(',').filter((id) => id.length > 0),
            undefined,
            parseInt(page as string) || 1,
            parseInt(resultsPerPage as string) || 999,
            SortMethod.fromType(sortMethod as string) || SortMethod.relevance
          )
          results.applyOnLeft((error) =>
            res.status(error.status).json(error.toObject())
          )
          results.applyOnRight((products) => {
            res.status(200).json(products)
          })
        }
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
