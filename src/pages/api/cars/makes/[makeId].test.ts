import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import * as InMemoryMongo from '../../../../utils/InMemoryMongo'
import { createCarMake } from '../../../../business/CarMakeManager'
import handler from '../../cars/makes/[makeId]'

describe('/api/cars/makes/:makeId', () => {
  let server: http.Server
  let url: string
  let makeId: string = 'makeId'
  beforeAll(async () => {
    let requestHandler = async (req, res) => {
      return apiResolver(
        req,
        res,
        { makeId: makeId },
        handler,
        {} as any,
        undefined
      )
    }
    server = http.createServer(requestHandler)
    url = await listen(server)
  })

  afterAll(async () => {
    server.close()
  })

  describe('GET', () => {
    beforeAll(async () => {
      await InMemoryMongo.connect()
    })

    afterAll(async () => {
      await InMemoryMongo.clearDatabase()
      await InMemoryMongo.closeDatabase()
    })

    it('should return 405 "Method Not Allowed" when the request method is different than GET', async () => {
      expect.assertions(4)
      let response = await fetch(url + '/api/cars/makes/' + makeId, {
        method: 'POST',
      })

      expect(response.status).toBe(405)
      expect(response.headers.get('content-type')).toMatch(/json/)

      const jsonResult = await response.json()

      expect(jsonResult.type).toEqual('/method-not-allowed')
      expect(jsonResult.instance).toEqual('/cars/makes/' + makeId)
    })

    it('should return 404 "Not found" when car make with given id does not exists', async () => {
      expect.assertions(4)

      let response = await fetch(url + '/api/cars/makes/' + makeId)

      expect(response.status).toBe(404)
      expect(response.headers.get('content-type')).toMatch(/json/)

      const jsonResult = await response.json()

      expect(jsonResult.type).toEqual('/resource-not-found')
      expect(jsonResult.instance).toEqual('/cars/makes/' + makeId)
    })

    it('should return car make', async () => {
      expect.assertions(3)
      const createdCarMake = await createCarMake({ name: 'Audi' })

      if (createdCarMake.isRight()) {
        makeId = createdCarMake.value.id
        let response = await fetch(url + '/api/cars/makes/' + makeId)

        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toMatch(/json/)

        const jsonResult = await response.json()

        expect(jsonResult).toEqual(createdCarMake.value)
      }
    })
  })
})
