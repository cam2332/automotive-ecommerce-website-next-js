import { Document } from 'mongoose'

export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface UserDocument extends Document {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
}
