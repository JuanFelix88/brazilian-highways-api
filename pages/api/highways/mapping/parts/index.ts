import { KeyPointer } from '@/src/application/entities/key-pointer'
import { SavePointersFromHighwayId } from '@/src/application/use-cases/save-pointers-from-highway-id'
import { DataMappingService } from '@/src/infra/data-mapping/data-mapping.service'
import { DataMappingHighwaysRepository } from '@/src/infra/data-mapping/repositories/data-mapping-highways-repository'
import { DataMappingPointersRepository } from '@/src/infra/data-mapping/repositories/data-mapping-pointers-repository'
import { Controller } from '@/src/utils/controller'

namespace PartsController {
  export type Body = Array<Partial<KeyPointer>>
}

class PartsController extends Controller {
  private readonly dataMappingService = new DataMappingService()

  private readonly dataMappingPointersRepository =
    new DataMappingPointersRepository(this.dataMappingService)

  private readonly dataMappingHighwaysRepository =
    new DataMappingHighwaysRepository(this.dataMappingService)

  private readonly savePointersFromHighwayId = new SavePointersFromHighwayId(
    this.dataMappingPointersRepository,
    this.dataMappingHighwaysRepository
  )

  /**
   * For mapping of the highway with the defined excerpts
   * Add Keypointers for highway
   */
  async post(
    req: Controller.Request<PartsController.Body>,
    res: Controller.Response
  ) {
    try {
      const partialKeypointersList = req.body

      if (
        !Array.isArray(partialKeypointersList) ||
        partialKeypointersList.length === 0
      ) {
        return res.status(400).send({
          error: 'data must be array with a list of pointers'
        })
      }

      const [{ rodId: firstHighwayIdFromKeypointer }] = partialKeypointersList

      if (!firstHighwayIdFromKeypointer) {
        return res.status(400).send({
          error:
            'array malformed, was not possible to capture the first highwayId for verification'
        })
      }

      if (
        partialKeypointersList.some(
          keypointer => keypointer.rodId !== firstHighwayIdFromKeypointer
        )
      ) {
        return res.status(400).send({
          error:
            "array malformed, there are items on the list that are not compatible with 'rodId'"
        })
      }

      const result = await this.savePointersFromHighwayId.execute({
        highwayId: firstHighwayIdFromKeypointer,
        pointers: partialKeypointersList as KeyPointer[]
      })

      if (!result) {
        return res.status(400).send({
          error:
            'It was not possible to enter the data because it was not accepted by the`data-mapping`'
        })
      }

      return res.status(202).send('')
    } catch (error) {
      if (error instanceof Error)
        return res.status(400).send({
          error: error.message
        })

      res.status(400).send('')
    }
  }
}

export default PartsController.defineHandler()
