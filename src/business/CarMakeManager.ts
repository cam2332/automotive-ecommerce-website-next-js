import { ICarMake } from '../DAO/documents/CarMake'
import CarMake from '../DAO/models/CarMake'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromCarMakeDocument } from '../utils/MongoConverter'

export const createCarMake = async (requestBody: {
  name: string
}): Promise<Either<ApplicationError, ICarMake>> => {
  if (!requestBody.name) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'name' property must be present in the request body.`
      ).setInstance('/cars/makes')
    )
  }
  if (typeof requestBody.name !== 'string' || requestBody.name.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'name' property must be a string.`
      ).setInstance('/cars/makes')
    )
  }

  try {
    const carMake = await CarMake.findMakeByName(requestBody.name)

    if (carMake) {
      return left(
        ApplicationError.RESOURCE_EXISTS.setDetail(
          `Car make with name '${requestBody.name}' already exists.`
        ).setInstance(`/cars/makes/${carMake.id}`)
      )
    } else {
      const createdCarMake = await CarMake.createMake(requestBody.name)

      return right(fromCarMakeDocument(createdCarMake))
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot create car make.'
      ).setInstance('/cars/makes')
    )
  }
}

export const findAllCarMakes = async (): Promise<
  Either<ApplicationError, ICarMake[]>
> => {
  try {
    const makes = await CarMake.findAllMakes()
    return right(makes.map((carMake) => fromCarMakeDocument(carMake)))
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot find car makes.'
      ).setInstance('/cars/makes')
    )
  }
}

export const findCarMakeById = async (
  id: string
): Promise<Either<ApplicationError, ICarMake>> => {
  if (id === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
        `The 'id' URL parameter must be provided in the request.`
      ).setInstance('/cars/makes/:id')
    )
  }
  if (typeof id !== 'string' || id.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PATH_PARAMETER.setDetail(
        `The 'id' path parameter must be a string.`
      ).setInstance('/cars/makes/:id')
    )
  }

  try {
    const carMake = await CarMake.findMakeById(id)

    if (carMake) {
      return right(fromCarMakeDocument(carMake))
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `Car make with id ${id} does not exists.`
        ).setInstance(`/cars/makes/${id}`)
      )
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find car make with id ${id}.`
      ).setInstance(`/cars/makes/${id}`)
    )
  }
}

export const findCarMakeByName = async (
  name: string
): Promise<Either<ApplicationError, ICarMake>> => {
  if (name === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
        `The 'name' URL parameter must be provided in the request.`
      ).setInstance('/cars/makes')
    )
  }
  if (typeof name !== 'string' || name.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PATH_PARAMETER.setDetail(
        `The 'name' path parameter must be a string.`
      ).setInstance('/cars/makes')
    )
  }

  try {
    const carMake = await CarMake.findMakeByName(name)

    if (carMake) {
      return right(fromCarMakeDocument(carMake))
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `Car make with name ${name} does not exists.`
        ).setInstance('/cars/makes')
      )
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot find car make.'
      ).setInstance('/cars/makes')
    )
  }
}

export const findCarMakesByTypeIds = async (
  typeIds: string[]
): Promise<Either<ApplicationError, ICarMake[]>> => {
  try {
    const makes = await CarMake.findMakesByTypeIds(typeIds)
    return right(makes.map((carMake) => fromCarMakeDocument(carMake)))
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find car makes with type ids [${typeIds.toString()}].`
      ).setInstance('/cars/makes')
    )
  }
}
