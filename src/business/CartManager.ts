import { ICart } from '../DAO/documents/User'
import User from '../DAO/models/User'
import CartProduct from '../DAO/types/CartProduct'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { fromUserDocument } from '../utils/MongoConverter'
import { findProductById } from './ProductManager'

export const getProducts = async (
  userId: string
): Promise<Either<ApplicationError, ICart[]>> => {
  try {
    const user = await User.findUserById(userId)
    if (!user) {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with id ${userId} does not exists.`
        ).setInstance(`/users/${userId}`)
      )
    }
    return right(fromUserDocument(user).cart)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find a cart.`
      ).setInstance(`/cart`)
    )
  }
}

export const addProduct = async (
  userId: string,
  productId: string,
  amountToAdd: number,
  setAddQuantity: boolean
): Promise<Either<ApplicationError, CartProduct>> => {
  try {
    let cartProduct: CartProduct
    const productResult = await findProductById(productId)
    if (productResult.isRight()) {
      if (amountToAdd > productResult.value.quantity) {
        return left(
          ApplicationError.OPERATION_INVALID_FOR_CURRENT_STATE.setDetail(
            'Selected quantity exceeds the maximum quantity of this product.'
          ).setInstance('/cart')
        )
      }
      try {
        const user = await User.findUserById(userId)
        if (!user) {
          return left(
            ApplicationError.RESOURCE_NOT_FOUND.setDetail(
              `User with id ${userId} does not exists.`
            ).setInstance(`/users/${userId}`)
          )
        }
        const index = user.cart.findIndex(
          (product) => product.productId === productId
        )
        if (index !== -1) {
          const newQuantity = setAddQuantity
            ? amountToAdd
            : user.cart[index].quantity + amountToAdd
          if (newQuantity > productResult.value.quantity) {
            return left(
              ApplicationError.OPERATION_INVALID_FOR_CURRENT_STATE.setDetail(
                'There is already the maximum quantity of the selected product in the cart.'
              ).setInstance('/cart')
            )
          }
          user.cart[index].quantity = newQuantity
          cartProduct = {
            ...productResult.value,
            selectedAmount: newQuantity,
          }
        } else {
          user.cart.push({
            productId,
            quantity: amountToAdd,
          })
          cartProduct = {
            ...productResult.value,
            selectedAmount: amountToAdd,
          }
        }
        await user.save()
        return right(cartProduct)
      } catch (error) {
        return left(
          ApplicationError.INTERNAL_ERROR.setDetail(
            `Cannot add product to cart.`
          ).setInstance(`/cart`)
        )
      }
    } else {
      return left(productResult.value)
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot add product to cart.`
      ).setInstance(`/cart`)
    )
  }
}

export const removeProduct = async (
  userId: string,
  productId: string
): Promise<Either<ApplicationError, ICart[]>> => {
  try {
    const user = await User.findUserById(userId)
    if (!user) {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with id ${userId} does not exists.`
        ).setInstance(`/users/${userId}`)
      )
    }
    user.cart = user.cart.filter((product) => product.productId !== productId)
    await user.save()
    return right(fromUserDocument(user).cart)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot remove product from cart.`
      ).setInstance(`/cart`)
    )
  }
}

export const removeAllProducts = async (
  userId: string
): Promise<Either<ApplicationError, ICart[]>> => {
  try {
    const user = await User.findUserById(userId)
    if (!user) {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `User with id ${userId} does not exists.`
        ).setInstance(`/users/${userId}`)
      )
    }
    user.cart = []
    await user.save()
    return right(fromUserDocument(user).cart)
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot remove all products from cart.`
      ).setInstance(`/cart`)
    )
  }
}
