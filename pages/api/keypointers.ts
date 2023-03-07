import { FindPointers } from '@/src/application/use-cases/find-pointers'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { Controller } from '@/src/utils/controller'

export namespace KeypointersController {
  export namespace GET {
    export interface Params {
      q?: string
    }
  }
}

export class KeypointersController extends Controller {
  constructor(private readonly findPointers: FindPointers) {
    super()
  }

  async get(req: Controller.Request, res: Controller.Response) {
    try {
      const { q: search } = req.query as KeypointersController.GET.Params

      const { pointers: keypointers } = await this.findPointers.execute({
        search
      })

      res.status(200).send(keypointers)
    } catch (err) {
      if (err instanceof Error && err.message === 'no keypointer was found') {
        return res.status(404).send({
          error: err.message
        })
      }

      throw err
    }
  }
}

export default KeypointersController.defineHandlerWithDependencyInjects([
  FindPointers,
  DataMappingPointersRepository,
  DataMappingService
])
