import { Highway } from '@/src/application/entities/highway'
import { HighwaysRepository } from '@/src/application/repositories/highways-repository'
import { DataMappingService } from '../data-mapping.service'

export class DataMappingHighwaysRepository implements HighwaysRepository {
  #dataStoreName = 'highways.json'

  constructor(private readonly dataMappingService: DataMappingService) {}
  private computeId<T extends { id: number }>(list: T[]): number {
    const greatherId = list.reduce(
      (greatherId, { id }) => (greatherId > id ? greatherId : id),
      0
    )
    return greatherId + 1
  }

  async create({
    code,
    concessionaireLink,
    concessionaireName,
    description,
    emergencyContacts,
    hasConcessionaire,
    name
  }: Partial<Highway>): Promise<{ id: number }> {
    const highwaysList: Highway[] =
      await this.dataMappingService.getCacheDataByFile(this.#dataStoreName)

    const computedId = this.computeId(highwaysList)

    highwaysList.push({
      code,
      concessionaireLink,
      concessionaireName,
      description,
      emergencyContacts,
      hasConcessionaire,
      name,
      id: computedId
    } as Highway)

    await this.dataMappingService.saveCacheData(
      highwaysList,
      this.#dataStoreName
    )

    return { id: computedId }
  }

  async findById(highwayId: number): Promise<Highway | null> {
    const highwaysList: Highway[] =
      await this.dataMappingService.getCacheDataByFile(this.#dataStoreName)

    return highwaysList.find(highway => highway.id === highwayId) ?? null
  }

  async save({
    code,
    concessionaireLink,
    concessionaireName,
    description,
    emergencyContacts,
    hasConcessionaire,
    id,
    name
  }: Highway): Promise<void> {
    const highwaysList: Highway[] =
      await this.dataMappingService.getCacheDataByFile(this.#dataStoreName)

    await this.dataMappingService.saveCacheData(
      highwaysList.map(highway =>
        highway.id === id
          ? {
              code,
              concessionaireLink,
              concessionaireName,
              description,
              emergencyContacts,
              hasConcessionaire,
              name
            }
          : highway
      ),
      this.#dataStoreName
    )
  }
}
