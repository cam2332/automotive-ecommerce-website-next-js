import { Schema, Types } from 'mongoose'
import { CarMakeDocument } from '../documents/CarMake'
// eslint-disable-next-line import/no-cycle
import CarMake from '../models/CarMake'

const CarMakeSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    models: [{ type: String, ref: 'CarModels' }],
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
  })

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

CarMakeSchema.statics.findMakesByTypeIds = async (
  typeIds: string[]
): Promise<CarMakeDocument[]> => {
  const makes = await CarMake.aggregate([
    {
      $sort: {
        name: 1,
      },
    },
    {
      $lookup: {
        from: 'CarModels',
        localField: '_id',
        foreignField: 'makeId',
        as: 'models',
      },
    },
    {
      $unwind: {
        path: '$models',
      },
    },
    {
      $lookup: {
        from: 'CarTypes',
        localField: 'models._id',
        foreignField: 'modelId',
        as: 'types',
      },
    },
    {
      $match: {
        'types._id': {
          $in: typeIds,
        },
      },
    },
    {
      $addFields: {
        'models.types': {
          $concatArrays: ['$types', []],
        },
      },
    },
    {
      $project: {
        name: 1,
        models: 1,
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        models: {
          $push: '$models',
        },
      },
    },
  ])

  return makes
}

export default CarMakeSchema
