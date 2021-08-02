import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import CarType from '../../../../DAO/models/CarType'

export default async function handler(
  { method, query: { typeId } }: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        if (typeId === undefined || typeId === '') {
          res.status(400).json({ success: false, message: 'Invalid parameter' })
        } else {
          const type = await CarType.findTypeById(typeId.toString())

          if (type) {
            res.status(200).json({
              success: true,
              data: type,
            })
          } else {
            res.status(404).json({
              success: false,
              message: 'Type with given id not found',
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
