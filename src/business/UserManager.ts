import { IUser } from '../DAO/documents/User'
import User from '../DAO/models/User'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromUserDocument } from '../utils/MongoConverter'
import { encryptPassword, verifyPassword } from '../utils/passwordUtils'

export const createUser = async (requestBody: {
  name: string
  email: string
  password: string
}): Promise<Either<ApplicationError, IUser>> => {
  if (!requestBody.name) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'name' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (typeof requestBody.name !== 'string' || requestBody.name.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'name' property must be a string.`
      ).setInstance('/users')
    )
  }
  if (!requestBody.email) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'email' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (typeof requestBody.email !== 'string' || requestBody.email.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'email' property must be a string.`
      ).setInstance('/users')
    )
  }
  if (!requestBody.password) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'password' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (
    typeof requestBody.password !== 'string' ||
    requestBody.password.length < 1
  ) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'password' property must be a string.`
      ).setInstance('/users')
    )
  }

  try {
    const encrypted = await encryptPassword(requestBody.password)
    const user = await User.createUser(
      requestBody.name,
      requestBody.email,
      encrypted
    )
    return right(fromUserDocument(user))
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot create user'
      ).setInstance('/users')
    )
  }
}

export const loginUser = async (requestBody: {
  email: string
  password: string
}): Promise<Either<ApplicationError, IUser>> => {
  if (!requestBody.email) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'email' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (typeof requestBody.email !== 'string' || requestBody.email.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'email' property must be a string.`
      ).setInstance('/users')
    )
  }
  if (!requestBody.password) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'password' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (
    typeof requestBody.password !== 'string' ||
    requestBody.password.length < 1
  ) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'password' property must be a string.`
      ).setInstance('/users')
    )
  }
  try {
    const user = await User.findUserByEmail(requestBody.email)

    if (!user) {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with email '${requestBody.email}' does not exists.`
        ).setInstance(`/users/${requestBody.email}`)
      )
    }

    if (await verifyPassword(user.password, requestBody.password)) {
      return right(fromUserDocument(user))
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find user with email '${requestBody.email}'.`
      ).setInstance(`/users`)
    )
  }
}
