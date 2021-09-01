import { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '../../../business/UserManager'
import { IUser } from '../../../DAO/documents/User'
import { authenticateUser } from '../../../services/Tokens'
import defaultHandler from '../../_defaultHandler'

const handler = defaultHandler<NextApiRequest, NextApiResponse>().post(
  async (req, res) => {
    const user = await createUser(req.body)

    if (user.isRight()) {
      authenticateUser(res, user.value as IUser)
      res.json(user.value)
    } else {
      res.status(user.value.status).json(user.value.toObject())
    }
  }
)

export default handler
