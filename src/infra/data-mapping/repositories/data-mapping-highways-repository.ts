import { Highway } from '@/src/application/entities/highway'
import { HighwaysRepository } from '@/src/application/repositories/highways-repository'
import { DataMappingService, Filenames } from '../data-mapping.service'
import MiniSearch, { SearchResult } from 'minisearch'
import removeAccents from 'remove-accents'

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

  async getAll(): Promise<Highway[]> {
    const highways = await this.dataMappingService.loadFromName(
      Filenames.Highways
    )
    return highways
  }

  async findByName(highwayName: string): Promise<Highway[]> {
    const search = highwayName
    const highways: Highway[] = await this.dataMappingService.loadFromName(
      Filenames.Highways
    )

    const miniSearch = new MiniSearch<Highway>({
      fields: ['name', 'code'] as Array<keyof Highway>,
      idField: 'id',
      storeFields: [
        'id',
        'name',
        'code',
        'hasConcessionaire',
        'emergencyContacts',
        'description',
        'concessionaireName',
        'concessionaireLink'
      ] as Array<keyof Highway>,
      processTerm: term => removeAccents(term.toLowerCase()),
      searchOptions: {
        processTerm: term => removeAccents(term.toLowerCase())
      }
    })

    miniSearch.addAll(highways)

    const searchResult: Array<SearchResult & Highway> = miniSearch.search(
      search
    ) as []

    return searchResult.map(result => ({
      id: result.id,
      code: result.code,
      description: result.description,
      emergencyContacts: result.emergencyContacts,
      hasConcessionaire: result.hasConcessionaire,
      name: result.name,
      concessionaireLink: result.concessionaireLink,
      concessionaireName: result.concessionaireName
    }))
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
              name,
              id
            }
          : highway
      ),
      this.#dataStoreName
    )
  }
}
