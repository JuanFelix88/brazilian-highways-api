import { KilometerMarker } from '@/src/application/entities/kilometer-marker'
import { PointerWithDistanceMeasure } from '@/src/application/entities/pointer-with-distance-measure'
import { PointersRepository } from '@/src/application/repositories/pointers-repository'
import { getProximityBetwenPositions } from '@/src/utils/get-proximity-between-positions'

export class InMemoryPointersRepository implements PointersRepository {
  public values: KilometerMarker[] = []

  async create(pointer: Partial<KilometerMarker>): Promise<{ id: number }> {
    const id = this.values.length + 1
    this.values.push({ ...pointer, id } as KilometerMarker)
    return {
      id
    }
  }

  async findByHighwayId(highwayId: number): Promise<KilometerMarker[]> {
    return this.values.filter(({ rodId }) => rodId === highwayId)
  }

  async insertMany(
    pointers: Array<Partial<KilometerMarker>>
  ): Promise<boolean> {
    this.values = [...this.values, ...(pointers as KilometerMarker[])]

    return true
  }

  async deleteById(keypointerId: number): Promise<void> {
    const filteredValues = this.values.filter(
      highway => highway.id !== keypointerId
    )

    this.values = filteredValues
  }

  async find(query: {
    highwayId?: number | undefined
    search?: string | undefined
  }): Promise<KilometerMarker[]> {
    const search = query.search?.toLowerCase()
    const { highwayId } = query
    return this.values.filter(
      pointer =>
        ((highwayId ? pointer.rodId === highwayId : true) &&
          pointer.km.toString().toLowerCase().includes(search!)) ||
        pointer.city.toLowerCase().includes(search!) ||
        pointer.uf.toLowerCase().includes(search!)
    )
  }

  async findById(keypointerId: number): Promise<KilometerMarker | null> {
    return this.values.find(({ id }) => id === keypointerId) ?? null
  }

  async findByProximity(
    position: [number, number],
    ray: number
  ): Promise<PointerWithDistanceMeasure[]> {
    const measuredIn = 'meters'

    const filteredPointers = this.values
      .filter(
        ({ position: pointerPosition }) =>
          getProximityBetwenPositions(position, pointerPosition, {
            measure: measuredIn
          }) <= ray
      )
      .map(
        pointer =>
          ({
            ...pointer,
            measuredIn,
            distanceMeasure: getProximityBetwenPositions(
              position,
              pointer.position,
              {
                measure: measuredIn
              }
            )
          } satisfies PointerWithDistanceMeasure)
      )

    return filteredPointers
  }

  async save(modifiedPointer: KilometerMarker): Promise<void> {
    this.values = this.values.map(oldPointer =>
      oldPointer.id === modifiedPointer.id ? modifiedPointer : oldPointer
    )
  }
}
