import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import { findCarMakeById } from '../../../../business/CarMakeManager'
import ApplicationError from '../../../../utils/ApplicationError'

export default async function handler(
  { method, query: { makeId } }: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
  } catch (err) {
    const error = ApplicationError.INTERNAL_ERROR.setDetail(
      'The server is currently unable to complete the request.'
    ).setInstance('/cars/makes/' + makeId)

    res.status(error.status).json(error.toObject())
  }

  switch (method) {
    case 'GET':
      const foundCarMake = await findCarMakeById(makeId.toString())

      foundCarMake.applyOnLeft((error) => {
        res.status(error.status).json(error.toObject())
      })

      foundCarMake.applyOnRight((carMake) => res.status(200).json(carMake))

      break
    default:
      const error = ApplicationError.METHOD_NOT_ALLOWED.setDetail(
        `The '${method}' method is not supported.`
      ).setInstance('/cars/makes/' + makeId)

      res.status(error.status).json(error.toObject())
      break
  }
}
