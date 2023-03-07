import { KeyPointer } from '../entities/key-pointer'
import { HighwaysRepository } from '../repositories/highways-repository'
import { PointersRepository } from '../repositories/pointers-repository'

export namespace CreatePointerFromHighwayId {
  export interface Request {
    highwayId: number
    pointer: Omit<KeyPointer, 'rodId'>
  }

  export interface Response {
    id: number
  }
}

export class CreatePointerFromHighwayId {
  constructor(
    private readonly pointersRepository: PointersRepository,
    private readonly highwaysRepository: HighwaysRepository
  ) {}

  async execute({
    highwayId,
    pointer
  }: CreatePointerFromHighwayId.Request): Promise<CreatePointerFromHighwayId.Response> {
    const highway = await this.highwaysRepository.findById(highwayId)

    if (!highway) {
      throw new Error('highway not found')
    }

    const { id } = await this.pointersRepository.create({
      accuracyInMeters: pointer.accuracyInMeters,
      city: pointer.city,
      direction: pointer.direction,
      km: pointer.km,
      marker: pointer.marker,
      position: pointer.position,
      uf: pointer.uf
    })

    return { id }
  }
}
