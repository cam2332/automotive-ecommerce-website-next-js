import { Document } from 'mongoose'
import { CarTypeDocument, ICarType } from './CarType'

export interface ICarModel {
  id: string
  group: string
  name: string
  productionStartYear: string
  productionEndYear: string
  makeId: string
  types: ICarType[]
}

export interface CarModelDocument extends Document {
  id: string
  group: string
  name: string
  productionStartYear: string
  productionEndYear: string
  makeId: string
  types: CarTypeDocument[]
}
