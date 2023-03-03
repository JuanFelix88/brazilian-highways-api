import { Highway } from '@/src/application/entities/highway'
import { CreateHighway } from '@/src/application/use-cases/create-highway'
import { HighwayValidationError } from '@/src/application/use-cases/errors/highway-validation-error'
import { FindHighwaysByName } from '@/src/application/use-cases/find-highways-by-name'
import { GetAllHighways } from '@/src/application/use-cases/get-all-highways'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { createHighwayBody } from '@/src/infra/http/dtos/create-highway-body'
import { Controller } from '@/src/utils/controller'

namespace HighwaysController {
  export namespace Post {
    export type RequestBody = Omit<Highway, 'id'>
  }
}

class HighwaysController extends Controller {
  private readonly dataMappingService = new DataMappingService()

  private readonly dataMappingHighwaysRepository =
    new DataMappingHighwaysRepository(this.dataMappingService)

  private readonly findHighwaysByName = new FindHighwaysByName(
    this.dataMappingHighwaysRepository
  )

  private readonly createHighway = new CreateHighway(
    this.dataMappingHighwaysRepository
  )

  private readonly getAllHighways = new GetAllHighways(
    this.dataMappingHighwaysRepository
  )

  async get(req: Controller.Request, res: Controller.Response) {
    try {
      const { q: searchQuery } = req.query as { q: string }

      if (!searchQuery) {
        const { highways: allHighwaysList } =
          await this.getAllHighways.execute()

        return res.status(200).send(allHighwaysList)
      }

      const { highways: highwaysFetchedByNameList } =
        await this.findHighwaysByName.execute({
          highwayName: searchQuery
        })

      return res.status(200).send(highwaysFetchedByNameList)
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }
      const { message } = error

      switch (message) {
        case 'No highway was found':
          return res.status(404).send({ error: 'No highway was found' })
        default:
          return res.status(400).send({ error: message })
      }
    }
  }

  async post(
    req: Controller.Request<HighwaysController.Post.RequestBody>,
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

      const highway = createHighwayBody({
        code,
        description,
        emergencyContacts,
        hasConcessionaire,
        name,
        concessionaireLink,
        concessionaireName
      })
      const { id } = await this.createHighway.execute(highway)

      res.status(201).send({ id })
    } catch (error) {
      if (error instanceof HighwayValidationError) {
        return res.status(400).send({
          error: error.viewMessage
        })
      }
      return res.status(500).send('')
    }
  }
}

export default HighwaysController.defineHandler()
