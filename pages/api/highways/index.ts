import { Highway } from '@/src/application/entities/highway'
import { CreateHighway } from '@/src/application/use-cases/create-highway'
import { HighwayValidationError } from '@/src/application/use-cases/errors/highway-validation-error'
import {
  DataMappingService,
  Filenames
} from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { createHighwayBody } from '@/src/infra/http/dtos/create-highway-body'
import { Controller } from '@/src/utils/controller'
import { NextApiRequest, NextApiResponse } from 'next'

namespace HighwaysController {
  export namespace Post {
    export type RequestBody = Omit<Highway, 'id'>
  }
}

class HighwaysController extends Controller {
  private readonly dataMappingService = new DataMappingService()

  private readonly dataMappingHighwaysRepository =
    new DataMappingHighwaysRepository(this.dataMappingService)

  private readonly createHighway = new CreateHighway(
    this.dataMappingHighwaysRepository
  )

  async get(req: Controller.Request, res: Controller.Response) {
    const { q } = req.query as { q: string }

    if (typeof q !== 'string') {
      return res.status(400).send({
        error: 'query text must be provided with `q` param'
      })
    }

    const highwayList: Highway[] = await this.dataMappingService.loadFromName(
      Filenames.Highways
    )
    const queryTextInLowercase = q.toLowerCase()

    const highwayFilteredByTextList = highwayList.filter(
      highway =>
        highway.code.toLowerCase().includes(queryTextInLowercase) ||
        highway.concessionaireName
          ?.toLowerCase()
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          .includes(queryTextInLowercase) ||
        highway.name.toLowerCase().includes(queryTextInLowercase) ||
        highway.description.toLowerCase().includes(queryTextInLowercase)
    )

    return res.status(200).send(highwayFilteredByTextList)
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
