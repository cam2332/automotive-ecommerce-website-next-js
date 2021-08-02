import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import CarType from '../../../../DAO/models/CarType'

export default async function handler(
  { method, query: { makeId, modelId } }: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        let types
        if (makeId) {
          types = await CarType.findTypesByMakeId(makeId.toString())
        } else if (modelId) {
          types = await CarType.findTypesByModelId(modelId.toString())
        } else {
          res
            .status(400)
            .json({ success: false, message: 'Invalid parameters' })
        }

        if (types) {
          res.status(200).json({
            success: true,
            data: types,
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
