import { Document } from 'mongoose'

export type CarTypeGroups = 'petrol' | 'diesel' | 'lpg' | 'electric'

export interface ICarType {
  id: string
  group: CarTypeGroups
  engineDisplacement: string
  type: string
  kW: string
  HP: string
  productionStartYear: string
  productionEndYear: string
}

export interface CarTypeDocument extends Document {
  id: string
  group: CarTypeGroups
  engineDisplacement: string
  type: string
  kW: string
  HP: string
  productionStartYear: string
  productionEndYear: string
}
