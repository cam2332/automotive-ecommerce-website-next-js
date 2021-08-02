import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import CarModel from '../../../../DAO/models/CarModel'

export default async function handler(
  { method, query: { modelId } }: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        if (modelId === undefined || modelId === '') {
          res.status(400).json({ success: false, message: 'Invalid parameter' })
        } else {
          const model = await CarModel.findModelById(modelId.toString())

          if (model) {
            res.status(200).json({
              success: true,
              data: model,
            })
          } else {
            res.status(404).json({
              success: false,
              message: 'Model with given id not found',
            })
          }
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
