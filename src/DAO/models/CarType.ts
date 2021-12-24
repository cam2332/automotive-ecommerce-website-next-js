import { Model, model } from 'mongoose'
import { CarTypeDocument } from '../documents/CarType'
// eslint-disable-next-line import/no-cycle
import CarTypeSchema from '../schemas/CarTypeSchema'

export interface CarTypeModel extends Model<CarTypeDocument> {
  findTypesByModelId(modelId: string): Promise<CarTypeDocument[]>
  findTypesByMakeId(makeId: string): Promise<CarTypeDocument[]>
  findTypeById(typeId: string): Promise<CarTypeDocument>
}

let carType: CarTypeModel

try {
  carType = model('CarTypes') as CarTypeModel
} catch {
  carType = model<CarTypeDocument, CarTypeModel>(
    'CarTypes',
    CarTypeSchema,
    'CarTypes'
  )
}

export default carType
