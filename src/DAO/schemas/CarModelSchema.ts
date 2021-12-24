import { Schema } from 'mongoose'
import { CarModelDocument } from '../documents/CarModel'
// eslint-disable-next-line import/no-cycle
import CarModel from '../models/CarModel'

const CarModelSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    group: { type: String, required: true },
    name: { type: String, required: true },
    productionStartYear: { type: String, required: true },
    productionEndYear: { type: String, required: true },
    makeId: { type: String, ref: 'CarMakes' },
    types: [{ type: String, ref: 'CarTypes' }],
  },
  {
    collection: 'CarModels',
  }
)

export default CarModelSchema

CarModelSchema.statics.findModelsByMakeId = async (
  makeId: string
): Promise<CarModelDocument[]> => {
  const models = await CarModel.find(
    { makeId: makeId },
    {
      _id: 0,
      id: '$_id',
      group: 1,
      name: 1,
      productionStartYear: 1,
      productionEndYear: 1,
      makeId: 1,
      types: 1,
    }
  ).sort({
    group: 1,
    name: 1,
  })

  return models
}

CarModelSchema.statics.findModelById = async (
  modelId: string
): Promise<CarModelDocument> => {
  const model = await CarModel.findOne(
    { _id: modelId },
    {
      _id: 0,
      id: '$_id',
      group: 1,
      name: 1,
      productionStartYear: 1,
      productionEndYear: 1,
      makeId: 1,
      types: 1,
    }
  )

  return model
}
