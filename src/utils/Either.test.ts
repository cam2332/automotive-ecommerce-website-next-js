/* eslint-disable no-undef */
import { Left, Right, left, right } from './Either'

describe('Either', () => {
  it('should create instance of Left', () => {
    const instance = new Left('left')
    expect(instance.isLeft()).toEqual(true)
    expect(instance.isRight()).toEqual(false)
    instance.applyOnLeft((value) => {
      expect(value).toEqual('left')
    })
  })

  it('should create instance of Right', () => {
    const instance = new Right('right')
    expect(instance.isLeft()).toEqual(false)
    expect(instance.isRight()).toEqual(true)
    instance.applyOnRight((value) => {
      expect(value).toEqual('right')
    })
  })

  it('should create instance of Left using wrapper method', () => {
    const instance = left('left')
    expect(instance.isLeft()).toEqual(true)
    expect(instance.isRight()).toEqual(false)
    instance.applyOnLeft((value) => {
      expect(value).toEqual('left')
    })
  })

  it('should create instance of Right using wrapper method', () => {
    const instance = right('right')
    expect(instance.isLeft()).toEqual(false)
    expect(instance.isRight()).toEqual(true)
    instance.applyOnRight((value) => {
      expect(value).toEqual('right')
    })
  })
})
