import { Document } from 'mongoose'

export interface Property {
  name: string
  unit?: string
  value: string
}

export interface IProduct {
  id: string
  title: string
  subTitle?: string
  identifier: string
  price: number
  oldPrice?: number
  currency: string
  quantity: number
  properties?: Property[]
  manufacturer: string
  categoryId: string
  compatibleCarTypeIds?: string[]
  thumbnailUrl: string
  inWishList: boolean
}

export interface ProductDocument extends Document {
  id: string
  title: string
  subTitle?: string
  identifier: string
  price: number
  oldPrice?: number
  currency: string
  quantity: number
  properties?: Property[]
  manufacturer: string
  categoryId: string
  compatibleCarTypeIds?: string[]
  thumbnailUrl: string
  inWishList?: boolean
}
