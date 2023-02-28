import { KilometerMarker } from '@/src/application/entities/kilometer-marker'
import { PointersRepository } from '@/src/application/repositories/pointers-repository'

export class InMemoryPointersRepository implements PointersRepository {
  public values: KilometerMarker[] = []

  async create(pointer: Partial<KilometerMarker>): Promise<{ id: number }> {
    this.values.push(pointer as KilometerMarker)
    return {
      id: this.values.length
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
}
