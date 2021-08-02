import { Model, model } from 'mongoose'
import { CarMakeDocument } from '../documents/CarMake'
import CarMakeSchema from '../schemas/CarMakeSchema'

export interface CarMakeModel extends Model<CarMakeDocument> {
  findAllMakes(): Promise<CarMakeDocument[]>
  findMakeById(makeId: string): Promise<CarMakeDocument>
}

let carMake: CarMakeModel

try {
  carMake = model('CarMakes') as CarMakeModel
} catch {
  carMake = model<CarMakeDocument, CarMakeModel>(
    'CarMakes',
    CarMakeSchema,
    'CarMakes'
  )
}

export default carMake