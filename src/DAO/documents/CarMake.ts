import { Document } from 'mongoose'
import { CarModelDocument, ICarModel } from './CarModel'

export interface ICarMake {
  id: string
  name: string
}

export interface CarMakeDocument extends Document {
  id: string
  name: string
}
