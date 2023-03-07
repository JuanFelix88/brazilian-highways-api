import { KeyPointer } from '@/src/application/entities/key-pointer'
import { CreatePointerFromHighwayId } from '@/src/application/use-cases/create-pointer-from-highway-id'
import { DeletePointerById } from '@/src/application/use-cases/delete-pointer-by-id'
import { FindPointerById } from '@/src/application/use-cases/find-pointer-by-id'
import { SaveKeypointerChanges } from '@/src/application/use-cases/save-keypointer-changes'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { createPointerBody } from '@/src/infra/http/dtos/create-pointer-body'
import { Controller } from '@/src/utils/controller'
import { ZodError } from 'zod'

export namespace HighwayKeypointer {
  export type CustomPointer = Omit<KeyPointer, 'rodId'>

  export namespace GET {
    export interface Params {
      highwayId: number
      keypointerId: number
    }
  }

  export namespace PUT {
    export interface Params {
      highwayId: number
      keypointerId: number
    }

    export type Body = CustomPointer
  }

  export namespace DELETE {
    export interface Params {
      highwayId: number
      keypointerId: number
    }
  }

  export type CreatePointerBodyFunc = (p: CustomPointer) => KeyPointer
}

export class HighwayKeypointer extends Controller {
  constructor(
    private readonly saveKeypointerChanges: SaveKeypointerChanges,
    private readonly findPointerById: FindPointerById,
    private readonly deletePointerById: DeletePointerById,
    private readonly createPointerBody: HighwayKeypointer.CreatePointerBodyFunc
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

  async put(
    req: Controller.Request<HighwayKeypointer.PUT.Body>,
    res: Controller.Response
  ) {
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

      const pointer = this.createPointerBody(req.body)

      await this.saveKeypointerChanges.execute({
        accuracyInMeters: pointer.accuracyInMeters,
        city: pointer.city,
        direction: pointer.direction,
        id: keypointerId,
        km: pointer.km,
        marker: pointer.marker,
        position: pointer.position,
        rodId: highwayId,
        uf: pointer.uf
      })

      res.status(204).send('')
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(406).send({
          error: err.issues.map(({ message }) => message)
        })
      }

      if (err instanceof Error && err.message === 'pointer not found') {
        return res.status(404).send({
          error: err.message
        })
      }

      throw err
    }
  }

  async delete(req: Controller.Request, res: Controller.Response) {
    try {
      const query = req.query as HighwayKeypointer.DELETE.Params

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

      await this.deletePointerById.execute({ keypointerId })

      res.status(204).send('')
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
  CreatePointerFromHighwayId,
  FindPointerById,
  SaveKeypointerChanges,
  createPointerBody,
  DeletePointerById
])
