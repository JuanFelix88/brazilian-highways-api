import { Highway } from '@/src/application/entities/highway'
import { HighwaysRepository } from '@/src/application/repositories/highways-repository'

export class InMemoryHighwaysRepository implements HighwaysRepository {
  private memoryId = 0
  public values: Highway[] = []

  protected incrementId() {
    return this.memoryId++
  }

  async create(highway: Partial<Highway>): Promise<{ id: number }> {
    const id = this.incrementId()
    this.values.push({ ...highway, id } as Highway)

    return {
      id
    }
  }

  async findById(highwayId: number): Promise<Highway | null> {
    return this.values.find(({ id }) => id === highwayId) ?? null
  }

  async save(highwayModified: Highway): Promise<void> {
    this.values.map(odlHighway =>
      odlHighway.id === highwayModified.id ? highwayModified : odlHighway
    )
  }
}
