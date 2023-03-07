import { KeyPointer } from '../entities/key-pointer'
import { PointersRepository } from '../repositories/pointers-repository'

export namespace FindPointers {
  export interface Request {
    search?: string
  }
  export interface Response {
    pointers: KeyPointer[]
  }
}

export class FindPointers {
  constructor(private readonly pointersRepository: PointersRepository) {}

  async execute({
    search
  }: FindPointers.Request): Promise<FindPointers.Response> {
    const keypointers = await this.pointersRepository.find({
      search
    })

    if (keypointers.length === 0) {
      throw new Error('no keypointer was found')
    }

    return {
      pointers: keypointers.map(keypointer => ({
        accuracyInMeters: keypointer.accuracyInMeters,
        city: keypointer.city,
        direction: keypointer.direction,
        id: keypointer.id,
        km: keypointer.km,
        marker: keypointer.marker,
        position: keypointer.position,
        rodId: keypointer.rodId,
        uf: keypointer.uf
      }))
    }
  }
}
