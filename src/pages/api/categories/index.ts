import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect'
import { createCategory, findAll } from '../../../business/CategoryManager'
import ApplicationError from '../../../utils/ApplicationError'
import IllegalArgumentError from '../../../utils/errors/IllegalArgumentError'
import CategoryCriteriaBuilder from '../../../DAO/types/CategoryCriteriaBuilder'
import PageableBuilder from '../../../DAO/types/PageableBuilder'
import SortCriteriaBuilder from '../../../DAO/types/SortCriteriaBuilder'

export default async function handler(
  { method, query, body }: NextApiRequest,
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
        const categories = await findAll(
          new CategoryCriteriaBuilder()
            .withName(query.name as string)
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
            .withFlat((query.flat as string) === 'true')
            .build()
        )

        res.status(200).json(categories)
      } catch (err) {
        if (err instanceof IllegalArgumentError) {
          const error = ApplicationError.UNSUPPORTED_QUERY_PARAMETER.setDetail(
            err.message
          ).setInstance('/categories')

          res.status(error.status).json(error.toObject())
        } else {
          const error = ApplicationError.INTERNAL_ERROR.setDetail(
            'Cannot find categories'
          ).setInstance('/categories')

          res.status(error.status).json(error.toObject())
        }
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
