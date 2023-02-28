import { Highway } from '@/src/application/entities/highway'

export abstract class HighwaysRepository {
  abstract create(highway: Partial<Highway>): Promise<{ id: number }>
  abstract findById(highwayId: number): Promise<Highway | null>
  abstract save(highwayModified: Highway): Promise<void>
}
