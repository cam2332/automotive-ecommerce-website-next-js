import mongoose from 'mongoose'
import { connect, closeDatabase, clearDatabase, mongodb } from './InMemoryMongo'

describe('InMemoryMongo', () => {
  it('should connect to database', async () => {
    await connect()

    expect(mongodb.instanceInfo).toBeTruthy()

    expect(mongoose.connection.readyState).toEqual(1)
  })

  it('should clear database', async () => {
    await mongoose.connection.createCollection('test collection')
    mongoose.connection.collection('test collection').insertOne({
      name: 'test doc',
    })

    expect(
      await mongoose.connection.collection('test collection').findOne({})
    ).toHaveProperty('name', 'test doc')

    await clearDatabase()

    expect(
      await mongoose.connection.collection('test collection').findOne({})
    ).toBeNull()
  })

  it('should close database', async () => {
    await closeDatabase()

    expect(mongoose.connection.readyState).toEqual(0)
    expect(mongodb.instanceInfo).toBeFalsy()
  })
})
