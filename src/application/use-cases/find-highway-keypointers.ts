import { Highway } from '@/src/application/entities/highway'
import { KeyPointer } from '../entities/key-pointer'
import { HighwaysRepository } from '../repositories/highways-repository'
import { PointersRepository } from '../repositories/pointers-repository'

export namespace FindHighwayKeypointers {
  export interface Request {
    highwayId: Highway['id']
    search?: string
  }

  export interface Response {
    keypointers: KeyPointer[]
  }
}

export class FindHighwayKeypointers {
  constructor(
    private readonly pointersRepository: PointersRepository,
    private readonly highwaysRepository: HighwaysRepository
  ) {}

  async execute({
    highwayId,
    search
  }: FindHighwayKeypointers.Request): Promise<FindHighwayKeypointers.Response> {
    if (!highwayId) {
      throw new Error('highwayId not provided')
    }

    const highway = await this.highwaysRepository.findById(highwayId)

    if (!highway) {
      throw new Error('highway not found')
    }

    const keypointers = await this.pointersRepository.find({
      highwayId,
      search
    })

    return {
      keypointers: keypointers.map(keypointer => ({
        accuracyInMeters: keypointer.accuracyInMeters,
        city: keypointer.city,
        direction: keypointer.direction,
        km: keypointer.km,
        marker: keypointer.marker,
        position: keypointer.position,
        rodId: keypointer.rodId,
        uf: keypointer.uf,
        id: keypointer.id
      }))
    }
  }
}
