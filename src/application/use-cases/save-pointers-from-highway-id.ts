import { KeyPointer } from '../entities/key-pointer'
import { HighwaysRepository } from '../repositories/highways-repository'
import { PointersRepository } from '../repositories/pointers-repository'

export namespace SavePointersFromHighwayId {
  export interface Request {
    highwayId: number
    pointers: Array<Partial<KeyPointer>>
  }

  export type Response = boolean
}

export class SavePointersFromHighwayId {
  constructor(
    private readonly pointersRepository: PointersRepository,
    private readonly highwaysRepository: HighwaysRepository
  ) {}

  async execute({
    highwayId,
    pointers
  }: SavePointersFromHighwayId.Request): Promise<SavePointersFromHighwayId.Response> {
    const highway = await this.highwaysRepository.findById(highwayId)

    if (!highway) {
      throw new Error('highway not found')
    }

    const response = await this.pointersRepository.insertMany(
      pointers.map(pointer => ({
        accuracyInMeters: pointer.accuracyInMeters,
        city: pointer.city,
        direction: pointer.direction,
        km: pointer.km,
        marker: pointer.marker,
        position: pointer.position,
        rodId: highwayId,
        uf: pointer.uf
      }))
    )

    return response
  }
}
