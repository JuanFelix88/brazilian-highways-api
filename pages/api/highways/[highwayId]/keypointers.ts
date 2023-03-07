import { FindHighwayKeypointers } from '@/src/application/use-cases/find-highway-keypointers'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { Controller } from '@/src/utils/controller'

namespace HighwayKeypointersController {
  export namespace GET {
    export interface Params {
      highwayId: string
      q?: string
    }
  }
}

export class HighwayKeypointersController extends Controller {
  constructor(private readonly findHighwayKeypointers: FindHighwayKeypointers) {
    super()
  }

  async get(req: Controller.Request, res: Controller.Response) {
    try {
      const query = req.query as HighwayKeypointersController.GET.Params

      const highwayId = Number(query.highwayId)
      const querySearch = query.q

      if (isNaN(highwayId)) {
        return res.status(400).send({
          error: 'invalid `highwayId` number'
        })
      }

      const { keypointers } = await this.findHighwayKeypointers.execute({
        highwayId,
        search: querySearch
      })

      return res.status(200).send(keypointers)
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }
      const { message } = error

      switch (message) {
        case 'highway not found':
          return res.status(404).send({ error: 'highway not found' })
        default:
          return res.status(400).send({ error: message })
      }
    }
  }
}

export default HighwayKeypointersController.defineHandlerWithDependencyInjects<HighwayKeypointersController>(
  [
    DataMappingService,
    DataMappingPointersRepository,
    DataMappingHighwaysRepository,
    FindHighwayKeypointers
  ]
)
