import { IProduct } from '../DAO/documents/Product'
import User from '../DAO/models/User'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromUserDocument } from '../utils/MongoConverter'
import { findProductById } from './ProductManager'
import { findUserById } from './UserManager'

export const getProducts = async (
  userId: string
): Promise<Either<ApplicationError, string[]>> => {
  try {
    const userResult = await findUserById(userId)
    if (userResult.isRight()) {
      return right(userResult.value.wishList || [])
    }
    return left(userResult.value)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find a wishlist.`
      ).setInstance(`/wishlist`)
    )
  }
}

export const addProduct = async (
  userId: string,
  productId: string
): Promise<Either<ApplicationError, IProduct>> => {
  try {
    const productResult = await findProductById(productId)
    if (productResult.isRight()) {
      const user = await User.findUserById(userId)
      if (!user) {
        return left(
          ApplicationError.RESOURCE_NOT_FOUND.setDetail(
            `User with id ${userId} does not exists.`
          ).setInstance(`/users/${userId}`)
        )
      }
      user.wishList = [...user.wishList, productId]
      await user.save()
      return right(productResult.value)
    }
    return left(productResult.value)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot add product to wishlist.`
      ).setInstance(`/wishlist`)
    )
  }
}

export const removeProduct = async (
  userId: string,
  productId: string
): Promise<Either<ApplicationError, string[]>> => {
  try {
    const user = await User.findUserById(userId)
    if (!user) {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with id ${userId} does not exists.`
        ).setInstance(`/users/${userId}`)
      )
    }
    user.wishList = user.wishList.filter((id) => id !== productId)
    await user.save()
    return right(fromUserDocument(user).wishList)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot remove product from wishlist.`
      ).setInstance(`/wishlist`)
    )
  }
}

export const removeAllProducts = async (
  userId: string
): Promise<Either<ApplicationError, string[]>> => {
  try {
    const user = await User.findUserById(userId)
    if (!user) {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with id ${userId} does not exists.`
        ).setInstance(`/users/${userId}`)
      )
    }
    user.wishList = []
    await user.save()
    return right(fromUserDocument(user).wishList)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot remove all products from wishlist.`
      ).setInstance(`/wishlist`)
    )
  }
}
