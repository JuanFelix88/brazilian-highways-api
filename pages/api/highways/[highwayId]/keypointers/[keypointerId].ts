import { KeyPointer } from '@/src/application/entities/key-pointer'
import { FindPointerById } from '@/src/application/use-cases/find-pointer-by-id'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { Controller } from '@/src/utils/controller'
import { ZodError } from 'zod'

export namespace HighwayKeypointer {
  export namespace GET {
    export interface Params {
      highwayId: number
      keypointerId: number
    }
  }
}

export class HighwayKeypointer extends Controller {
  constructor(
    private readonly findPointerById: FindPointerById,
  ) {
    super()
  }

  async get(req: Controller.Request, res: Controller.Response) {
    try {
      const query = req.query as HighwayKeypointer.GET.Params

      const highwayId = Number(query.highwayId)
      const keypointerId = Number(query.keypointerId)

      if (isNaN(highwayId)) {
        return res.status(400).send({
          error: `highwayId malformed or not provided`
        })
      }

      if (isNaN(keypointerId)) {
        return res.status(400).send({
          error: `keypointerId malformed or not provided`
        })
      }

      const pointer = await this.findPointerById.execute(keypointerId)

      res.status(200).send(pointer)
    } catch (err) {
      if (err instanceof Error && err.message === 'pointer not found') {
        return res.status(404).send({
          error: err.message
        })
      }

      throw err
    }
  }
}

export default HighwayKeypointer.defineHandlerWithDependencyInjects([
  DataMappingHighwaysRepository,
  DataMappingPointersRepository,
  DataMappingService,
  FindPointerById,
])
