import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect'
import {
  createCategory,
  findAllByName,
  findAllCategories,
} from '../../../business/CategoryManager'
import ApplicationError from '../../../utils/ApplicationError'
import SortMethod from '../../../DAO/types/SortMethod'

export default async function handler(
  {
    method,
    query: { name, page, resultsPerPage, sortMethod, tree },
    body,
  }: NextApiRequest,
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
        if (name) {
          const categories = await findAllByName(
            name as string,
            parseInt(page as string, 10) || 1,
            parseInt(resultsPerPage as string, 10) || 999,
            SortMethod.fromType(sortMethod as string) || SortMethod.relevance
          )
          res.status(200).json(categories)
        } else {
          const categories = await findAllCategories(
            tree && tree.toString() === 'true'
          )
          res.status(200).json(categories)
        }
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
