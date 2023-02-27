import { Highway } from '@/src/application/entities/highway'
import { CreateHighway } from '@/src/application/use-cases/create-highway'
import { HighwayValidationError } from '@/src/application/use-cases/errors/highway-validation-error'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-reposity'
import { createHighwayBody } from '@/src/infra/http/dtos/create-highway-body'
import { NextApiRequest, NextApiResponse } from 'next'

namespace Controller {
  export namespace Post {
    export type RequestBody = Omit<Highway, 'id'>
  }
}

class Controller {
  constructor(private readonly createHighway: CreateHighway) {}

  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      const {
        code,
        description,
        emergencyContacts,
        hasConcessionaire,
        name,
        concessionaireLink,
        concessionaireName
      } = req.body as Controller.Post.RequestBody

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

function createHighwayFactory() {
  return new CreateHighway(
    new DataMappingHighwaysRepository(new DataMappingService())
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new Controller(createHighwayFactory())

  if (!req.method || !['POST'].includes(req.method)) {
    return res.status(405).send('')
  }

  await controller[req.method.toLowerCase() as keyof Controller](req, res)
}
