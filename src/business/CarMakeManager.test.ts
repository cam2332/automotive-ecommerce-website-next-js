/* eslint-disable no-return-await */
/* eslint-disable no-undef */
import ApplicationError from '../utils/ApplicationError'
import * as InMemoryMongo from '../utils/InMemoryMongo'
import {
  createCarMake,
  findAllCarMakes,
  findCarMakeById,
  findCarMakeByName,
} from './CarMakeManager'

describe('CarMakeManager', () => {
  const carMakeName = 'Audi'
  let carMakeId: string

  describe('DB not connected', () => {
    it('should return an error "Internal error" when creating a car make', async () => {
      expect.assertions(1)
      const createdCarMake = await createCarMake({ name: carMakeName })

      createdCarMake.applyOnLeft((error) => {
        expect(error.type).toEqual(ApplicationError.INTERNAL_ERROR.type)
      })
    }, 10500)

    it('should return an error "Internal error" when searching for car make by id', async () => {
      expect.assertions(1)
      const carMake = await findCarMakeById('testId')

      carMake.applyOnLeft((error) => {
        expect(error.type).toEqual(ApplicationError.INTERNAL_ERROR.type)
      })
    }, 10500)

    it('should return an error "Internal error" when searching for car make by name', async () => {
      expect.assertions(1)
      const carMake = await findCarMakeByName(carMakeName)

      carMake.applyOnLeft((error) => {
        expect(error.type).toEqual(ApplicationError.INTERNAL_ERROR.type)
      })
    }, 10500)

    it('should return an error "Internal error" when searching for a car makes', async () => {
      expect.assertions(1)
      const makes = await findAllCarMakes()
      makes.applyOnLeft((error) => {
        expect(error.type).toEqual(ApplicationError.INTERNAL_ERROR.type)
      })
    }, 10500)
  })

  describe('DB connected', () => {
    beforeAll(async () => await InMemoryMongo.connect())
    afterAll(async () => await InMemoryMongo.closeDatabase())

    describe('createCarMake', () => {
      it('should create a car make', async () => {
        expect.assertions(2)
        const createdCarMake = await createCarMake({ name: carMakeName })

        createdCarMake.applyOnRight((carMake) => {
          carMakeId = carMake.id
          expect(carMake).toBeDefined()
          expect(carMake.name).toEqual(carMakeName)
        })
      })

      it('should not create a car make if name is not defined', async () => {
        expect.assertions(1)
        const createdCarMake = await createCarMake({} as any)

        createdCarMake.applyOnLeft((error) => {
          expect(error.type).toEqual(
            ApplicationError.MISSING_REQUIRED_PROPERTY.type
          )
        })
      })

      it('should not create a car make if name is not string', async () => {
        expect.assertions(1)
        const createdCarMake = await createCarMake({ name: ['test'] } as any)

        createdCarMake.applyOnLeft((error) => {
          expect(error.type).toEqual(ApplicationError.UNSUPPORTED_PROPERTY.type)
        })
      })

      it('should not create a car make if name is already present in the collection', async () => {
        expect.assertions(1)

        await createCarMake({ name: carMakeName })

        const createdCarMake = await createCarMake({ name: carMakeName })

        createdCarMake.applyOnLeft((error) => {
          expect(error.type).toEqual(ApplicationError.RESOURCE_EXISTS.type)
        })
      })
    })

    describe('findCarMakeById', () => {
      it('should find car make', async () => {
        expect.assertions(2)
        const carMake = await findCarMakeById(carMakeId)

        carMake.applyOnRight((carMake) => {
          expect(carMake.id).toEqual(carMakeId)
          expect(carMake.name).toEqual(carMakeName)
        })
      })

      it('should not find car make if id is not defined', async () => {
        expect.assertions(1)
        const carMake = await findCarMakeById(undefined as string)

        carMake.applyOnLeft((error) => {
          expect(error.type).toEqual(
            ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.type
          )
        })
      })

      it('should not find car make if id is not string', async () => {
        expect.assertions(1)
        const carMake = await findCarMakeById({} as string)

        carMake.applyOnLeft((error) => {
          expect(error.type).toEqual(
            ApplicationError.UNSUPPORTED_PATH_PARAMETER.type
          )
        })
      })

      it('should not find car make if it does not exists', async () => {
        expect.assertions(1)
        const carMake = await findCarMakeById('abcdefghijklmno123456789')

        carMake.applyOnLeft((error) => {
          expect(error.type).toEqual(ApplicationError.RESOURCE_NOT_FOUND.type)
        })
      })
    })

    describe('findCarMakeByName', () => {
      it('should find car make', async () => {
        expect.assertions(2)
        const carMake = await findCarMakeByName(carMakeName)

        carMake.applyOnRight((carMake) => {
          expect(carMake.id).toEqual(carMakeId)
          expect(carMake.name).toEqual(carMakeName)
        })
      })

      it('should not find car make if name is not defined', async () => {
        expect.assertions(1)
        const carMake = await findCarMakeByName(undefined as string)

        carMake.applyOnLeft((error) => {
          expect(error.type).toEqual(
            ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.type
          )
        })
      })

      it('should not find car make if name is not string', async () => {
        expect.assertions(1)
        const carMake = await findCarMakeByName({} as string)

        carMake.applyOnLeft((error) => {
          expect(error.type).toEqual(
            ApplicationError.UNSUPPORTED_PATH_PARAMETER.type
          )
        })
      })

      it('should not find car make if it does not exists', async () => {
        expect.assertions(1)
        const carMake = await findCarMakeByName('abcdefghijklmno123456789')

        carMake.applyOnLeft((error) => {
          expect(error.type).toEqual(ApplicationError.RESOURCE_NOT_FOUND.type)
        })
      })
    })

    describe('findAllCarMakes', () => {
      beforeAll(async () => await InMemoryMongo.clearDatabase())
      it('should return an empty array', async () => {
        expect.assertions(1)
        const makes = await findAllCarMakes()

        makes.applyOnRight((carMakes) => {
          expect(carMakes.length).toEqual(0)
        })
      })

      it('should return an array containing one car make', async () => {
        expect.assertions(2)

        const createdCarMake = await createCarMake({ name: carMakeName })

        if (createdCarMake.isRight) {
          const makes = await findAllCarMakes()

          makes.applyOnRight((carMakes) => {
            expect(carMakes).toHaveLength(1)
            expect(carMakes[0]).toEqual(createdCarMake.value)
          })
        }
      })
    })
  })
})
