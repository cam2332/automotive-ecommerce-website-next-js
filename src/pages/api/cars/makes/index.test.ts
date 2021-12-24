/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/server/api-utils'
import * as InMemoryMongo from '../../../../utils/InMemoryMongo'
import { createCarMake } from '../../../../business/CarMakeManager'
import handler from './index'

describe('/api/cars/makes', () => {
  let server: http.Server
  let url: string
  beforeAll(async () => {
    const requestHandler = async (req, res) =>
      apiResolver(req, res, undefined, handler, {} as any, undefined)
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
      const response = await fetch(url + '/api/cars/makes', { method: 'POST' })

      expect(response.status).toBe(405)
      expect(response.headers.get('content-type')).toMatch(/json/)

      const jsonResult = await response.json()

      expect(jsonResult.type).toEqual('/method-not-allowed')
      expect(jsonResult.instance).toEqual('/cars/makes')
    })

    it('should return an empty array', async () => {
      expect.assertions(3)

      const response = await fetch(url + '/api/cars/makes')

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toMatch(/json/)

      const jsonResult = await response.json()

      expect(jsonResult).toHaveLength(0)
    })
    it('should return an array containing one car make', async () => {
      expect.assertions(4)
      const createdCarMake = await createCarMake({ name: 'Audi' })

      if (createdCarMake.isRight()) {
        const response = await fetch(url + '/api/cars/makes')

        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toMatch(/json/)

        const jsonResult = await response.json()

        expect(jsonResult).toHaveLength(1)
        expect(jsonResult[0]).toEqual(createdCarMake.value)
      }
    })
  })
})
