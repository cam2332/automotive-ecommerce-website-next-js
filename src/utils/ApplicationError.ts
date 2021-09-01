export default class ApplicationError {
  /**
   * @param {string} title - A required query parameter was not specified in the request URL.
   * @param {number} status - 400
   */
  public static MISSING_REQUIRED_QUERY_PARAMETER = new ApplicationError(
    'A required query parameter was not specified in the request URL.',
    400,
    '/missing-required-query-parameter'
  )

  /**
   * @param {string} title - One of the query parameters specified in the request URL is not supported.
   * @param {number} status - 400
   */
  public static UNSUPPORTED_QUERY_PARAMETER = new ApplicationError(
    'One of the query parameters specified in the request URL is not supported.',
    400,
    '/unsupported-query-parameter'
  )

  /**
   * @param {string} title - A required path parameter was not specified in the request URL.
   * @param {number} status - 400
   */
  public static MISSING_REQUIRED_PATH_PARAMETER = new ApplicationError(
    'A required path parameter was not specified in the request URL.',
    400,
    '/missing-required-path-parameter'
  )

  /**
   * @param {string} title - One of the path parameters specified in the request URL is not supported.
   * @param {number} status - 400
   */
  public static UNSUPPORTED_PATH_PARAMETER = new ApplicationError(
    'One of the path parameters specified in the request URL is not supported.',
    400,
    '/unsupported-path-parameter'
  )

  /**
   * @param {string} title - A required property was not specified in the request body.
   * @param {number} status - 400
   */
  public static MISSING_REQUIRED_PROPERTY = new ApplicationError(
    'A required property was not specified in the request body.',
    400,
    '/missing-required-property'
  )

  /**
   * @param {string} title - One of the properties specified in the request body is not supported.
   * @param {number} status - 400
   */
  public static UNSUPPORTED_PROPERTY = new ApplicationError(
    'One of the properties specified in the request body is not supported.',
    400,
    '/unsupported-property'
  )

  /**
   * @param {string} title - A required authorization header was not provided.
   * @param {number} status - 401
   */
  public static UNAUTHORIZED = new ApplicationError(
    'A required authorization header was not provided.',
    401,
    '/unauthorized'
  )

  /**
   * @param {string} title - The specified resource does not exist.
   * @param {number} status - 404
   */
  public static RESOURCE_NOT_FOUND = new ApplicationError(
    'The specified resource does not exist.',
    404,
    '/resource-not-found'
  )

  /**
   * @param {string} title - The method received in the request is not supported by the target resource.
   * @param {number} status - 405
   */
  public static METHOD_NOT_ALLOWED = new ApplicationError(
    'The method received in the request is not supported by the target resource.',
    405,
    '/method-not-allowed'
  )

  /**
   * @param {string} title - The specified resource already exists.
   * @param {number} status - 409
   */
  public static RESOURCE_EXISTS = new ApplicationError(
    'The specified resource already exists.',
    409,
    '/resource-exists'
  )

  /**
   * @param {string} title - The specified operation is not valid for the current state of the resource.
   * @param {number} status - 409
   */
  public static OPERATION_INVALID_FOR_CURRENT_STATE = new ApplicationError(
    'The specified operation is not valid for the current state of the resource.',
    409,
    '/operation-invalid-for-current-state'
  )

  /**
   * @param {string} title - The server encountered an internal error. Please retry the request.
   * @param {number} status - 500
   */
  public static INTERNAL_ERROR = new ApplicationError(
    'The server encountered an internal error. Please retry the request.',
    500,
    '/internal-error'
  )

  constructor(
    public title: string,
    public status: number,
    public type: string = '/about:blank',
    public detail?: string,
    public instance?: string
  ) {}

  public setType(type: string): this {
    this.type = type
    return this
  }

  public setTitle(title: string): this {
    this.title = title
    return this
  }

  public setStatus(status: number): this {
    this.status = status
    return this
  }

  public setDetail(detail: string): this {
    this.detail = detail
    return this
  }

  public setInstance(instance: string): this {
    this.instance = instance
    return this
  }

  public toObject(): Object {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
    }
  }
}
