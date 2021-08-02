import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import CarModel from '../../../../DAO/models/CarModel'

export default async function handler(
  { method, query: { makeId } }: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        if (makeId === undefined || makeId === '') {
          res.status(400).json({ success: false, message: 'Invalid parameter' })
        } else {
          const models = await CarModel.findModelsByMakeId(makeId.toString())

          res.status(200).json({
            success: true,
            data: models,
          })
        }
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
