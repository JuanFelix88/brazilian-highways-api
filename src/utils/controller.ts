export namespace Controller {
  export interface Request<T = any> {
    method?: string
    body: T
    query: object
  }

  export interface Response {
    statusCode: number
    status: (st: number) => Response
    send: (data: any) => any
    json: (jsonData: object) => void
  }
}

export class Controller {
  static availableMethods = ['post', 'get', 'put', 'patch', 'delete', 'options']

  async handler(
    req: Controller.Request,
    res: Controller.Response
  ): Promise<any> {
    const requestMethod = req.method?.toLowerCase()

    if (
      !req.method ||
      !Controller.availableMethods.includes(requestMethod!) ||
      !Reflect.has(this, requestMethod!)
    ) {
      return res.status(405).send('')
    }

    return await this[requestMethod as keyof Controller]?.(req, res)
  }

  static defineHandler() {
    const instance = new this()

    return instance.handler.bind(instance)
  }
}
