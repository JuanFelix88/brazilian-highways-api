import { Highway } from '@/src/application/entities/highway'
import { SaveHighwayChanges } from '@/src/application/use-cases/save-highway-changes'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { createHighwayBody } from '@/src/infra/http/dtos/create-highway-body'
import { Controller } from '@/src/utils/controller'
import { HighwayValidationError } from '@/src/application/use-cases/errors/highway-validation-error'

namespace HighwayController {
  export namespace Put {
    export type RequestBody = Omit<Highway, 'id'>
    export interface RequestQuery {
      highwayId: string
    }
  }
}

class HighwayController extends Controller {
  private readonly dataMappingService = new DataMappingService()

  private readonly dataMappingHighwaysRepository =
    new DataMappingHighwaysRepository(this.dataMappingService)

  private readonly saveHighwayChanges = new SaveHighwayChanges(
    this.dataMappingHighwaysRepository
  )

  async put(
    req: Controller.Request<HighwayController.Put.RequestBody>,
    res: Controller.Response
  ) {
    try {
      const {
        code,
        description,
        emergencyContacts,
        hasConcessionaire,
        name,
        concessionaireLink,
        concessionaireName
      } = req.body

      const { highwayId } = req.query as HighwayController.Put.RequestQuery

      const id = Number(highwayId)

      if (isNaN(id)) {
        return res.status(400).send({
          error: 'invalid `id` number'
        })
      }

      const highwayData = createHighwayBody({
        code,
        description,
        emergencyContacts,
        hasConcessionaire,
        name,
        concessionaireLink,
        concessionaireName
      })

      await this.saveHighwayChanges.execute({
        highwayId: Number(highwayId),
        highwayData
      })

      return res.status(202).send('')
    } catch (error) {
      if (error instanceof HighwayValidationError) {
        return res.status(406).send({
          error: error.message
        })
      }

      if (error instanceof Error) {
        return res.status(400).send({
          error: error.message
        })
      }

      throw error
    }
  }
}

export default HighwayController.defineHandler()
