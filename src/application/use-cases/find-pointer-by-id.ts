import { KeyPointer } from '../entities/key-pointer'
import { PointersRepository } from '../repositories/pointers-repository'

export namespace FindPointerById {
  export type Request = number

  export type Response = KeyPointer
}

export class FindPointerById {
  constructor(private readonly pointersRepository: PointersRepository) {}

  async execute(
    pointerId: FindPointerById.Request
  ): Promise<FindPointerById.Response> {
    if (typeof pointerId !== 'number') {
      throw new Error('pointerId malformed or not provided')
    }

    const pointer = await this.pointersRepository.findById(pointerId)

    if (!pointer) {
      throw new Error('pointer not found')
    }

    return {
      accuracyInMeters: pointer.accuracyInMeters,
      city: pointer.city,
      direction: pointer.direction,
      km: pointer.km,
      marker: pointer.marker,
      position: pointer.position,
      rodId: pointer.rodId,
      uf: pointer.uf,
      id: pointer.id
    }
  }
}
