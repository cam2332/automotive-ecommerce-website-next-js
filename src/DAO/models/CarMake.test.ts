/* eslint-disable no-undef */
import * as InMemoryMongo from '../../utils/InMemoryMongo'
import CarMake from './CarMake'

describe('CarMake model', () => {
  const carMakeName = 'Audi'
  let carMakeId: string

  // eslint-disable-next-line no-return-await
  beforeAll(async () => await InMemoryMongo.connect())
  // eslint-disable-next-line no-return-await
  afterAll(async () => await InMemoryMongo.closeDatabase())

  it('should create a car make', async () => {
    expect.assertions(1)
    const createdCarMake = await CarMake.createMake(carMakeName)
    carMakeId = createdCarMake.id

    expect(createdCarMake.name).toEqual(carMakeName)
  })

  it('should find all car makes', async () => {
    expect.assertions(1)
    const carMakes = await CarMake.findAllMakes()

    expect(carMakes.length).toEqual(1)
  })

  it('should find car make by id', async () => {
    expect.assertions(3)
    const carMake = await CarMake.findMakeById(carMakeId)

    expect(carMake).toBeDefined()
    expect(carMake.id).toEqual(carMakeId)
    expect(carMake.name).toEqual(carMakeName)
  })

  it('should not find car make by id', async () => {
    expect.assertions(1)
    const carMake = await CarMake.findMakeById('')

    expect(carMake).toBeNull()
  })
})
