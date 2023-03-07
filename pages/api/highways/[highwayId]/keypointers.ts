import { KeyPointer } from '@/src/application/entities/key-pointer'
import { FindHighwayKeypointers } from '@/src/application/use-cases/find-highway-keypointers'
import { SavePointersFromHighwayId } from '@/src/application/use-cases/save-pointers-from-highway-id'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { createPointerBody } from '@/src/infra/http/dtos/create-pointer-body'
import { Controller } from '@/src/utils/controller'
import { ZodError } from 'zod'

namespace HighwayKeypointersController {
  export type CustomKeypointer = Omit<KeyPointer, 'rodId'>

  export namespace GET {
    export interface Params {
      highwayId: string
      q?: string
    }
  }

  export namespace POST {
    export type Body = CustomKeypointer[]

    export interface Params {
      highwayId: string
    }
  }

  export type CreatePointerBodyFunc = (p: CustomKeypointer) => KeyPointer
}

export class HighwayKeypointersController extends Controller {
  constructor(
    private readonly findHighwayKeypointers: FindHighwayKeypointers,
    private readonly savePointersFromHighwayId: SavePointersFromHighwayId,
    private readonly createPointerBody: HighwayKeypointersController.CreatePointerBodyFunc
  ) {
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

  async post(
    req: Controller.Request<HighwayKeypointersController.POST.Body>,
    res: Controller.Response
  ) {
    try {
      const query = req.query as HighwayKeypointersController.POST.Params

      const highwayId = Number(query.highwayId)

      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).send({
          error: 'data must be array with a list of pointers'
        })
      }

      if (isNaN(highwayId)) {
        return res.status(400).send({
          error: 'invalid `highwayId` number'
        })
      }

      const keypointers = req.body.map(this.createPointerBody)

      const resultBool = await this.savePointersFromHighwayId.execute({
        highwayId,
        pointers: keypointers
      })

      if (!resultBool) {
        return res.status(400).send({
          error:
            'an unexpected error occurred that made it impossible to enter the data'
        })
      }

      res.status(201).send('')
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(406).send({
          error: err.issues.map(({ message }) => message)
        })
      }

      if (err instanceof Error) {
        return res.status(400).send({
          error: err.message
        })
      }

      throw err
    }
  }
}

export default HighwayKeypointersController.defineHandlerWithDependencyInjects<HighwayKeypointersController>(
  [
    DataMappingService,
    DataMappingPointersRepository,
    DataMappingHighwaysRepository,
    FindHighwayKeypointers,
    SavePointersFromHighwayId,
    createPointerBody
  ]
)
