import { KeyPointer } from '../entities/key-pointer'
import { PointerWithDistanceMeasure } from '../entities/pointer-with-distance-measure'

export abstract class PointersRepository {
  abstract create(pointer: Partial<KeyPointer>): Promise<{ id: number }>
  abstract insertMany(pointers: Array<Partial<KeyPointer>>): Promise<boolean>
  abstract findByHighwayId(highwayId: number): Promise<KeyPointer[]>
  abstract find(query: {
    highwayId?: number
    search?: string
  }): Promise<KeyPointer[]>
  abstract findById(keypointerId: number): Promise<KeyPointer | null>
  abstract save(modifiedPointer: KeyPointer): Promise<void>
  abstract deleteById(keypointerId: number): Promise<void>
  abstract findByProximity(
    position: [number, number],
    ray: number
  ): Promise<PointerWithDistanceMeasure[]>
}
