import { Schema, Types } from 'mongoose'
import { UserDocument } from '../documents/User'
// eslint-disable-next-line import/no-cycle
import User from '../models/User'

const CartSchema: Schema = new Schema({
  productId: { type: Schema.Types.String, required: true },
  quantity: { type: Schema.Types.Number, required: true },
})

const UserSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true },
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
    cart: [{ type: CartSchema }],
    wishList: [{ type: Schema.Types.String }],
  },
  {
    collection: 'Users',
  }
)

UserSchema.statics.createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<UserDocument> => {
  const user = new User({
    _id: Types.ObjectId().toHexString(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    cart: [],
  })
  const createdUser = await user.save()
  return createdUser
}

UserSchema.statics.findUserById = async (
  id: string
): Promise<UserDocument | null> => {
  const result = await User.findById(id)
  return result
}

UserSchema.statics.findUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  const result = await User.findOne({ email: email })
  return result
}

export default UserSchema
