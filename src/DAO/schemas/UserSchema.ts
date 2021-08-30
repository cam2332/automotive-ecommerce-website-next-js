import { Schema, Types } from 'mongoose'
import { UserDocument } from '../documents/User'
import User from '../models/User'

const UserSchema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
  },
  {
    collection: 'Users',
  }
)

UserSchema.statics.createUser = async (
  name: string,
  email: string,
  password: string
): Promise<UserDocument> => {
  const user = new User({
    _id: Types.ObjectId().toHexString(),
    name: name,
    email: email,
    password: password,
  })
  const createdUser = await user.save()
  return createdUser
}

UserSchema.statics.findUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  const result = await User.findOne({ email: email })
  return result
}

export default UserSchema
