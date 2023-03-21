import { Highway } from '@/src/application/entities/highway'
import { HighwaysRepository } from '@/src/application/repositories/highways-repository'

export class InMemoryHighwaysRepository implements HighwaysRepository {
  private memoryId = 1
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
    this.values = this.values.map(odlHighway =>
      odlHighway.id === highwayModified.id ? highwayModified : odlHighway
    )
  }

  async getAll(): Promise<Highway[]> {
    return this.values
  }

  async deleteById(highwayId: number): Promise<void> {
    const filteredValues = this.values.filter(
      highway => highway.id !== highwayId
    )

    this.values = filteredValues
  }

  async findByName(highwayName?: string | undefined): Promise<Highway[]> {
    const search = highwayName?.toLowerCase()
    return this.values.filter(
      highway =>
        highway.code.toLowerCase().includes(search!) ||
        highway.name.toLowerCase().includes(search!)
    )
  }
}
