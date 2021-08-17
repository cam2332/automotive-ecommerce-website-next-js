import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import { findAllCarMakes } from '../../../../business/CarMakeManager'
import ApplicationError from '../../../../utils/ApplicationError'

export default async function handler(
  { method }: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
  } catch (err) {
    console.log(err)
    const error = ApplicationError.INTERNAL_ERROR.setDetail(
      'The server is currently unable to complete the request.'
    ).setInstance('/cars/makes')

    res.status(error.status).json(error.toObject())
  }

  switch (method) {
    case 'GET':
      const makes = await findAllCarMakes()

      makes.applyOnLeft((error) => {
        res.status(error.status).json(error.toObject())
      })

      makes.applyOnRight((carMakes) => res.status(200).json(carMakes))

      break
    default:
      const error = ApplicationError.METHOD_NOT_ALLOWED.setDetail(
        `The '${method}' method is not supported.`
      ).setInstance('/cars/makes')

      res.status(error.status).json(error.toObject())
      break
  }
}
