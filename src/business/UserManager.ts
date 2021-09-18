import { IUser } from '../DAO/documents/User'
import User from '../DAO/models/User'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromUserDocument } from '../utils/MongoConverter'
import { encryptPassword, verifyPassword } from '../utils/passwordUtils'

export const createUser = async (requestBody: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<Either<ApplicationError, IUser>> => {
  if (!requestBody.firstName) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'first name' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (
    typeof requestBody.firstName !== 'string' ||
    requestBody.firstName.length < 1
  ) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'first name' property must be a string.`
      ).setInstance('/users')
    )
  }
  if (!requestBody.lastName) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'last name' property must be present in the request body.`
      ).setInstance('/users')
    )
  }
  if (
    typeof requestBody.lastName !== 'string' ||
    requestBody.lastName.length < 1
  ) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'last name' property must be a string.`
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
      requestBody.firstName,
      requestBody.lastName,
      requestBody.email,
      encrypted
    )
    return right(fromUserDocument(user))
  } catch (error) {
    if (error.code === 11000 && error.keyPattern['email'] === 1) {
      return left(
        ApplicationError.RESOURCE_EXISTS.setDetail(
          `User with e-mail '${requestBody.email}' already exists`
        ).setInstance('/users')
      )
    }
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
    const passwordCorrect = await verifyPassword(
      user.password,
      requestBody.password
    )
    if (passwordCorrect) {
      return right(fromUserDocument(user))
    } else {
      return left(
        ApplicationError.UNAUTHORIZED.setDetail(
          'Incorrect password.'
        ).setInstance('/users')
      )
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find user with email '${requestBody.email}'.`
      ).setInstance(`/users`)
    )
  }
}

export const findUserById = async (
  id: string
): Promise<Either<ApplicationError, IUser>> => {
  if (id === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
        `The 'id' URL parameter must be provided in the request.`
      ).setInstance('/users/:id')
    )
  }
  if (typeof id !== 'string' || id.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PATH_PARAMETER.setDetail(
        `The 'id' path parameter must be a string.`
      ).setInstance('/users/:id')
    )
  }

  try {
    const user = await User.findUserById(id)

    if (user) {
      return right(fromUserDocument(user))
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with id ${id} does not exists.`
        ).setInstance(`/users/${id}`)
      )
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find user with id ${id}.`
      ).setInstance(`/users/${id}`)
    )
  }
}
