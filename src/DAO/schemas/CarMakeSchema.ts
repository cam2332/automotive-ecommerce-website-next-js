import { Schema, Types } from 'mongoose'
import { CarMakeDocument } from '../documents/CarMake'
import CarMake from '../models/CarMake'

const CarMakeSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
  },
  {
    collection: 'CarMakes',
  }
)

CarMakeSchema.statics.createMake = async (
  name: string
): Promise<CarMakeDocument> => {
  const make = new CarMake({
    _id: Types.ObjectId().toHexString(),
    name: name,
  })
  const createdMake = await make.save()
  return createdMake
}

CarMakeSchema.statics.findAllMakes = async (): Promise<CarMakeDocument[]> => {
  const makes = await CarMake.find({}).sort({ name: 1 })
  return makes
}

CarMakeSchema.statics.findMakeById = async (
  makeId: string
): Promise<CarMakeDocument | null> => {
  const make = await CarMake.findOne({
    _id: makeId,
  }) //.populate({ path: 'models', model: CarModel })

  return make
}

CarMakeSchema.statics.findMakeByName = async (
  name: string
): Promise<CarMakeDocument | null> => {
  const make = await CarMake.findOne({
    name: new RegExp('.*' + name + '.*', 'i'),
  })
  return make
}

export default CarMakeSchema
