import { Model, model } from 'mongoose'
import { CarModelDocument } from '../documents/CarModel'
import CarModelSchema from '../schemas/CarModelSchema'

export interface CarModelModel extends Model<CarModelDocument> {
  findModelsByMakeId(makeId: string): Promise<CarModelDocument[]>
  findModelById(modelId: string): Promise<CarModelDocument>
}

let carModel: CarModelModel

try {
  carModel = model('CarModels') as CarModelModel
} catch {
  carModel = model<CarModelDocument, CarModelModel>(
    'CarModels',
    CarModelSchema,
    'CarModels'
  )
}

export default carModel
