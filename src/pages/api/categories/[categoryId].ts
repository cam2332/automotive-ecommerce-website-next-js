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
    ).setInstance('/categories/:id')

    res.status(error.status).json(error.toObject())
  }

  switch (method) {
    case 'GET':
      try {
        const foundCategory = await findCategoryById(categoryId.toString())

        foundCategory.applyOnLeft((error) => {
          if (!error.instance) {
            error.setInstance('/categories/:id')
          }
          res.status(error.status).json(error.toObject())
        })
        foundCategory.applyOnRight((category) => res.status(200).json(category))
      } catch (err) {
        const error = ApplicationError.RESOURCE_NOT_FOUND.setDetail(
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
