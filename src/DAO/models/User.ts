import { Model, model } from 'mongoose'
import { UserDocument } from '../documents/User'
import UserSchema from '../schemas/UserSchema'

export interface UserModel extends Model<UserDocument> {
  createUser(
    name: string,
    email: string,
    password: string
  ): Promise<UserDocument>
  findUserByEmail(email: string): Promise<UserDocument | null>
}

let user: UserModel

try {
  user = model('Users') as UserModel
} catch {
  user = model<UserDocument, UserModel>('Users', UserSchema, 'Users')
}

export default user
