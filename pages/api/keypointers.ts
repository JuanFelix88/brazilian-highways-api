import { FindPointers } from '@/src/application/use-cases/find-pointers'
import { FindPointersByPositionProximity } from '@/src/application/use-cases/find-pointers-by-position-proximity'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { Controller } from '@/src/utils/controller'

export namespace KeypointersController {
  export namespace GET {
    export interface Params {
      q?: string
      position?: string
      ray_proximity?: string
    }
  }
}

export class KeypointersController extends Controller {
  constructor(
    private readonly findPointers: FindPointers,
    private readonly findPointersByPositionProximity: FindPointersByPositionProximity
  ) {
    super()
  }

  async get(req: Controller.Request, res: Controller.Response) {
    try {
      const {
        q: search,
        position,
        ray_proximity: rayProximity = '1500'
      } = req.query as KeypointersController.GET.Params

      const isSearch = !!search
      const isPositionProximitySearch = !!position

      if (isSearch) {
        const { pointers: keypointers } = await this.findPointers.execute({
          search
        })

        return res.status(200).send(keypointers)
      }

      if (isPositionProximitySearch) {
        const { pointers: keypointers } =
          await this.findPointersByPositionProximity.execute({
            position: position.split(',').map(latlong => Number(latlong)) as [
              number,
              number
            ],
            rayProximity: Number(rayProximity)
          })

        return res.status(200).send(keypointers)
      }

      return res.status(400).send({
        error: 'no search method has been defined in query params'
      })
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
  DataMappingService,
  FindPointersByPositionProximity
])
