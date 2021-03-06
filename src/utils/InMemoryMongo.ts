import mongoose from 'mongoose'
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server'

export let mongodb = null

export const connect = async (): Promise<void> => {
  mongodb = await MongoMemoryServer.create()
  const uri = mongodb.getUri('Automotive-ECommerce')
  const mongooseOptions = {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  process.env.MONGODB_URI = uri

  await mongoose.connect(uri, mongooseOptions)
}

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongodb.stop()
  delete process.env.MONGODB_URI
}

export const clearDatabase = async (): Promise<void> => {
  const collections = await mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}
