import { NextApiRequest, NextApiResponse } from 'next'
import { findCategoryById } from '../../../business/CategoryManager'
import ApplicationError from '../../../utils/ApplicationError'
import dbConnect from '../../../utils/dbConnect'

export default async function handler(
  { method, query: { categoryId } }: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
  } catch (err) {
    const error = ApplicationError.INTERNAL_ERROR.setDetail(
      'The server is currently unable to complete the request.'
    ).setInstance('/categories')

    res.status(error.status).json(error.toObject())
  }

  switch (method) {
    case 'GET':
      try {
        if (
          categoryId === undefined ||
          typeof categoryId !== 'string' ||
          categoryId === ''
        ) {
          const error =
            ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
              `The 'id'' URL parameter must be provided in the request`
            ).setInstance('/categories/:id')

          res.status(error.status).json(error.toObject())
        } else {
          const result = await findCategoryById(categoryId.toString())

          result.applyOnLeft((error) =>
            res.status(error.status).json(error.toObject())
          )
          result.applyOnRight((category) => res.status(200).json(category))
        }
      } catch (err) {
        const error =
          ApplicationError.OPERATION_INVALID_FOR_CURRENT_STATE.setDetail(
            `Cannot get category with id '${categoryId}'.`
          ).setInstance('/categories/:id')

        res.status(error.status).json(error.toObject())
      }
      break
    default:
      const error = ApplicationError.METHOD_NOT_ALLOWED.setDetail(
        `The '${method}' method is not supported.`
      ).setInstance('/categories/:id')

      res.status(error.status).json(error.toObject())
      break
  }
}
