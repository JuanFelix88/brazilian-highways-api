import { describe, expect, it } from 'vitest'
import { Controller } from './controller'

class RepositoryExample {
  public findExample() {
    return true
  }
}

class ControllerTest extends Controller {
  constructor(private readonly repositoryExample = new RepositoryExample()) {
    super()
  }

  async get(_: Controller.Request, res: Controller.Response) {
    if (this.repositoryExample) {
      return res.status(200).send('Ok')
    }
    return res.status(400).send('Error')
  }
}

describe('Test shared extensible Controller', () => {
  const mockResponse: Partial<Controller.Response> = {
    statusCode: 500,
    status(st) {
      this.statusCode = st
      return this as any
    },
    send(data) {
      return [this.statusCode, data]
    }
  }

  it('should be response by simple mock request and response with 200 status code', async () => {
    const handler = ControllerTest.defineHandler()

    const mockRequest: Partial<Controller.Request> = {
      method: 'GET'
    }

    const [status, data] = await handler(
      mockRequest as any,
      mockResponse as any
    )

    expect(status).toBe(200)
    expect(data).toBe('Ok')
  })

  it('should not response because is invalid method', async () => {
    const handler = ControllerTest.defineHandler()

    const mockRequest: Partial<Controller.Request> = {
      method: 'DEL'
    }

    const [status] = await handler(mockRequest as any, mockResponse as any)

    expect(status).toBe(405)
  })
})
