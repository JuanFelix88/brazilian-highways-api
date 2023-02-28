import { Controller } from '@/src/utils/controller'

class InternalC {
  public getInternal() {
    return 'Hello World'
  }
}

class PartsController extends Controller {
  private readonly internalC = new InternalC()

  async get(req: Controller.Request, res: Controller.Response) {
    try {
      res.status(200).send({
        message: this.internalC.getInternal()
      })
    } catch (error) {
      res.status(400).send('')
    }
  }
}

export default PartsController.defineHandler()
