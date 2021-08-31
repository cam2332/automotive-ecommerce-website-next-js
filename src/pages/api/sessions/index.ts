import { NextApiRequest, NextApiResponse } from 'next'
import { loginUser } from '../../../business/UserManager'
import { IUser } from '../../../DAO/documents/User'
import { authenticateUser, clearUser } from '../../../services/Tokens'
import ApplicationError from '../../../utils/ApplicationError'
import defaultHandler from '../../_defaultHandler'

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await loginUser(req.body())
    if (user.isRight()) {
      authenticateUser(res, user.value as IUser)
      res.json(user)
    } else {
      res.status(user.value.status).json(user.value.toObject())
    }
  })
  .delete((_req, res) => {
    clearUser(res)
    res.send('')
  })

export default handler
