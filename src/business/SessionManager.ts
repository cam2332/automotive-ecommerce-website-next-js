import { IUser } from '../DAO/documents/User'
import { authenticateUser, clearUser, verifyToken } from '../services/Tokens'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { findUserById } from './UserManager'

const WRONG_TOKEN = ApplicationError.UNAUTHORIZED.setDetail(
  'Error verifying token.'
).setInstance('/sessions')

const NO_TOKEN =
  ApplicationError.UNAUTHORIZED.setDetail('No token provided.').setInstance(
    '/sessions'
  )

export const authorize = async (
  req,
  res
): Promise<Either<ApplicationError, { user: IUser; token: string }>> => {
  const token = req.headers.authorization || req.cookies.auth
  if (!token || token.length === 0) {
    return left(NO_TOKEN)
  }

  try {
    const data = verifyToken(token)
    const user = await findUserById(data.id)
    if (user.isRight()) {
      const newToken = authenticateUser(res, user.value as IUser)
      return right({ user: user.value, token: newToken })
    } else {
      clearUser(res)
      return left(WRONG_TOKEN)
    }
  } catch (err) {
    return left(WRONG_TOKEN)
  }
}
