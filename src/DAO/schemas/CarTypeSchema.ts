import { Schema } from 'mongoose'
import { CarTypeDocument } from '../documents/CarType'
import CarType from '../models/CarType'

const CarTypeSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    group: { type: String, required: true },
    engineDisplacement: { type: String, required: true },
    type: { type: String, required: true },
    kW: { type: String, required: true },
    HP: { type: String, required: true },
    productionStartYear: { type: String, required: true },
    productionEndYear: { type: String, required: true },
    modelId: { type: String, ref: 'CarModels' },
    makeId: { type: String, ref: 'CarMakes' },
  },
  {
    collection: 'CarTypes',
  }
)

CarTypeSchema.statics.findTypesByModelId = async (
  modelId: string
): Promise<CarTypeDocument[]> => {
  const types = await CarType.find(
    { modelId: modelId },
    {
      _id: 0,
      id: '$_id',
      group: 1,
      engineDisplacement: 1,
      type: 1,
      kW: 1,
      HP: 1,
      productionStartYear: 1,
      productionEndYear: 1,
      modelId: 1,
      makeId: 1,
    }
  ).sort({
    group: 1,
    engineDisplacement: 1,
    kW: 1,
    HP: 1,
  })

  return types
}

CarTypeSchema.statics.findTypesByMakeId = async (
  makeId: string
): Promise<CarTypeDocument[]> => {
  const types = await CarType.find(
    { makeId: makeId },
    {
      _id: 0,
      id: '$_id',
      group: 1,
      engineDisplacement: 1,
      type: 1,
      kW: 1,
      HP: 1,
      productionStartYear: 1,
      productionEndYear: 1,
      modelId: 1,
      makeId: 1,
    }
  ).sort({
    group: 1,
    engineDisplacement: 1,
    kW: 1,
    HP: 1,
  })

  return types
}

CarTypeSchema.statics.findTypeById = async (
  typeId: string
): Promise<CarTypeDocument> => {
  const type = await CarType.findOne(
    { _id: typeId },
    {
      _id: 0,
      id: '$_id',
      group: 1,
      engineDisplacement: 1,
      type: 1,
      kW: 1,
      HP: 1,
      productionStartYear: 1,
      productionEndYear: 1,
      modelId: 1,
      makeId: 1,
    }
  )

  return type
}

export default CarTypeSchema
