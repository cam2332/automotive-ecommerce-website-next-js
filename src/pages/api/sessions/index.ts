import { NextApiRequest, NextApiResponse } from 'next'
import { findUserById, loginUser } from '../../../business/UserManager'
import { IUser } from '../../../DAO/documents/User'
import {
  authenticateUser,
  clearUser,
  verifyToken,
} from '../../../services/Tokens'
import ApplicationError from '../../../utils/ApplicationError'
import defaultHandler from '../../_defaultHandler'

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await loginUser(req.body)
    if (user.isRight()) {
      const token = authenticateUser(res, user.value as IUser)
      res.status(200).json({ user: user.value, token })
    } else {
      res.status(user.value.status).json(user.value.toObject())
    }
  })
  .get(async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
      const error =
        ApplicationError.UNAUTHORIZED.setDetail(
          'No token provided.'
        ).setInstance('/sessions')
      res.status(error.status).json(error.toObject())
    }

    try {
      const data = verifyToken(token)
      const user = await findUserById(data.id)
      if (user.isRight()) {
        const newToken = authenticateUser(res, user.value as IUser)
        res.status(200).json({ user: user.value, token: newToken })
      } else {
        res.status(user.value.status).json(user.value.toObject())
      }
    } catch (err) {
      const error = ApplicationError.UNAUTHORIZED.setDetail(
        'Error verifying token.'
      ).setInstance('/sessions')
      res.status(error.status).json(error.toObject())
    }
  })
  .delete((_req, res) => {
    clearUser(res)
    res.send('')
  })

export default handler
