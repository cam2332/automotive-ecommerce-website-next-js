import { Document } from 'mongoose'

export interface IUser {
  id: string
  name: string
  email: string
}

export interface UserDocument extends Document {
  id: string
  name: string
  email: string
  password: string
}
