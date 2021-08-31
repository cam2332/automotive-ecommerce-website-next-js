import { NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import ApplicationError from '../utils/ApplicationError'

export default function defaultHandler<ReqType, ResType>() {
  return nextConnect<ReqType, ResType>({
    attachParams: true,
    onError: (err, req, res) => {
      console.error(err)
      ;(res as unknown as NextApiResponse)
        .status(500)
        .json(ApplicationError.INTERNAL_ERROR.toObject())
    },
  })
}
