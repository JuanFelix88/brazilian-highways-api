import { KeyPointer } from '../entities/key-pointer'
import { PointerWithDistanceMeasure } from '../entities/pointer-with-distance-measure'
import { PointersRepository } from '../repositories/pointers-repository'

export namespace FindPointersByPositionProximity {
  export interface Request {
    position: [number, number]
    rayProximity: number
  }
  export interface Response {
    pointers: PointerWithDistanceMeasure[]
  }
}

export class FindPointersByPositionProximity {
  constructor(private readonly pointersRepository: PointersRepository) {}

  async execute({
    position,
    rayProximity
  }: FindPointersByPositionProximity.Request): Promise<FindPointersByPositionProximity.Response> {
    if (
      position.length !== 2 ||
      typeof position[0] !== 'number' ||
      typeof position[1] !== 'number' ||
      position.some(p => isNaN(p))
    ) {
      throw new Error('position malformed, it needs to be a Lat Long position')
    }

    if (!rayProximity || isNaN(rayProximity)) {
      throw new Error('rayProximity malformed or not provided')
    }

    const keypointers = await this.pointersRepository.findByProximity(
      position,
      rayProximity
    )

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
        uf: keypointer.uf,
        distanceMeasure: keypointer.distanceMeasure,
        measuredIn: keypointer.measuredIn
      }))
    }
  }
}
