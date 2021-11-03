import { Document } from 'mongoose'

export interface ICart {
  productId: string
  quantity: number
}

export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  cart: ICart[]
  wishList: string[]
}

export interface UserDocument extends Document {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  cart: ICart[]
  wishList: string[]
}
