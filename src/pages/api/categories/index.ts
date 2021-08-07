import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect'
import Category from '../../../DAO/models/Category'
import {
  createDataTree,
  fromCategoryDocument,
} from '../../../utils/MongoConverter'
import {
  createCategory,
  findAllCategories,
} from '../../../business/CategoryManager'
import ApplicationError from '../../../utils/ApplicationError'

export default async function handler(
  { method, query: { tree }, body }: NextApiRequest,
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
        const categories = await findAllCategories(
          tree && tree.toString() === 'true'
        )
        res.status(200).json(categories)
      } catch (err) {
        const error = ApplicationError.INTERNAL_ERROR.setDetail(
          'Cannot find categories'
        ).setInstance('/categories')

        res.status(error.status).json(error.toObject())
      }
      break
    case 'POST':
      try {
        const result = await createCategory(body)
        result.applyOnLeft((error) =>
          res.status(error.status).json(error.toObject())
        )
        result.applyOnRight((createdCategory) => {
          res.status(201).json(createdCategory)
        })
      } catch (err) {
        const error =
          ApplicationError.OPERATION_INVALID_FOR_CURRENT_STATE.setDetail(
            'Cannot create category'
          ).setInstance('/categories')

        res.status(error.status).json(error.toObject())
      }
      break
    default:
      const error = ApplicationError.METHOD_NOT_ALLOWED.setDetail(
        `The '${method}' method is not supported.`
      ).setInstance('/categories')

      res.status(error.status).json(error.toObject())
      break
  }
}
