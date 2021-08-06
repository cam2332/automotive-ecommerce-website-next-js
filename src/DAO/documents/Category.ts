import { Document } from 'mongoose'

export interface ICategory {
  id: string
  name: string
  numberOfProducts: number
  parentCategoryId?: string
  categories?: ICategory[]
  thumbnailUrl?: string
}

export interface CategoryDocument extends Document {
  id: string
  name: string
  numberOfProducts: number
  parentCategoryId?: string
  categories?: string[]
  thumbnailUrl?: string
}
