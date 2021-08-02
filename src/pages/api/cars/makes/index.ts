import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../utils/dbConnect'
import CarMake from '../../../../DAO/models/CarMake'

export default async function handler(
  { method }: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const makes = await CarMake.findAllMakes()

        res.status(200).json({ success: true, data: makes })
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
