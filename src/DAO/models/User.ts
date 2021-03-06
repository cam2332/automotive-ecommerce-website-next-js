import { Model, model } from 'mongoose'
import { UserDocument } from '../documents/User'
// eslint-disable-next-line import/no-cycle
import UserSchema from '../schemas/UserSchema'

export interface UserModel extends Model<UserDocument> {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<UserDocument>
  findUserById(id: string): Promise<UserDocument | null>
  findUserByEmail(email: string): Promise<UserDocument | null>
}

let user: UserModel

try {
  user = model('Users') as UserModel
} catch {
  user = model<UserDocument, UserModel>('Users', UserSchema, 'Users')
}

export default user
