import { Model, model } from 'mongoose'
import { CarMakeDocument } from '../documents/CarMake'
// eslint-disable-next-line import/no-cycle
import CarMakeSchema from '../schemas/CarMakeSchema'

export interface CarMakeModel extends Model<CarMakeDocument> {
  createMake(name: string): Promise<CarMakeDocument>
  findAllMakes(): Promise<CarMakeDocument[]>
  findMakeById(makeId: string): Promise<CarMakeDocument | null>
  findMakeByName(name: string): Promise<CarMakeDocument | null>
  findMakesByTypeIds(typeIds: string[]): Promise<CarMakeDocument[]>
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
