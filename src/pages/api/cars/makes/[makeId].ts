import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import CarMake from '../../../../DAO/models/CarMake'

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
          const make = await CarMake.findMakeById(makeId.toString())

          if (make) {
            res.status(200).json({
              success: true,
              data: make,
            })
          } else {
            res.status(404).json({
              success: false,
              message: 'Make with given id not found',
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
