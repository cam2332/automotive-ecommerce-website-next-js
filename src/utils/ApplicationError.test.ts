import ApplicationError from './ApplicationError'

describe('ApplicationError', () => {
  it('should create a new ApplicationError', () => {
    const appError = new ApplicationError('Title', 400)

    expect(appError.type).toEqual('/about:blank')
    expect(appError.title).toEqual('Title')
    expect(appError.status).toEqual(400)
  })

  it('should change the type of the error', () => {
    const appError = new ApplicationError('Title', 400)
    appError.setType('/new-type')

    expect(appError.type).toEqual('/new-type')
  })

  it('should change the title of the error', () => {
    const appError = new ApplicationError('Title', 400)
    appError.setTitle('New Title')

    expect(appError.title).toEqual('New Title')
  })

  it('should change the status of the error', () => {
    const appError = new ApplicationError('Title', 400)
    appError.setStatus(401)

    expect(appError.status).toEqual(401)
  })

  it('should change the detail of the error', () => {
    const appError = new ApplicationError('Title', 400)
    appError.setDetail('New detail')

    expect(appError.detail).toEqual('New detail')
  })

  it('should change the instance of the error', () => {
    const appError = new ApplicationError('Title', 400)
    appError.setInstance('/instance')

    expect(appError.instance).toEqual('/instance')
  })

  it('should convert the instance of class to object', () => {
    const appError = new ApplicationError('Title', 400)

    const object = appError.toObject() as any
    expect(object.type).toEqual('/about:blank')
    expect(object.title).toEqual('Title')
    expect(object.status).toEqual(400)
    expect(object.detail).toEqual(undefined)
    expect(object.instance).toEqual(undefined)
  })
})
