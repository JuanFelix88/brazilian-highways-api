import { Highway } from '@/src/application/entities/highway'
import { KeyPointer } from '@/src/application/entities/key-pointer'
import { KilometerMarker } from '@/src/application/entities/kilometer-marker'
import { Pointer } from '@/src/application/entities/pointer'
import { PointersRepository } from '@/src/application/repositories/pointers-repository'
import { DataMappingService, Filenames } from '../data-mapping.service'
import MiniSearch, { Query, SearchResult } from 'minisearch'
import removeAccents from 'remove-accents'

export class DataMappingPointersRepository implements PointersRepository {
  constructor(private readonly dataMappingService: DataMappingService) {}

  async create(pointer: Partial<Pointer>): Promise<{ id: number }> {
    Object.assign(pointer, {
      id: ~~(Math.random() * 100_000_000_000)
    })
    await this.insertMany([pointer])

    return {
      id: (pointer as any).id
    }
  }

  async find({
    highwayId,
    search
  }: {
    highwayId?: number
    search?: string
  }): Promise<KilometerMarker[]> {
    const keypointers: KeyPointer[] =
      await this.dataMappingService.loadFromName(Filenames.KeyPointers)

    const miniSearch = new MiniSearch<KeyPointer>({
      fields: ['km', 'marker', 'city', 'uf', 'rodId'] as Array<
        keyof KeyPointer
      >,
      idField: 'position',
      storeFields: [
        'accuracyInMeters',
        'city',
        'direction',
        'km',
        'marker',
        'position',
        'rodId',
        'uf'
      ] as Array<keyof KeyPointer>,
      processTerm: term => removeAccents(term.toString().toLowerCase()),
      searchOptions: {
        processTerm: term => removeAccents(term.toString().toLowerCase())
      }
    })

    miniSearch.addAll(keypointers)

    const filteredKeypointersList: Array<SearchResult & KeyPointer> =
      miniSearch.search({
        combineWith: 'AND',
        queries: [
          {
            queries: [highwayId?.toString() ?? ''],
            fields: ['rodId']
          },
          search && {
            combineWith: 'OR',
            prefix: true,
            queries: [
              {
                queries: [search.toString()],
                fields: ['km', 'marker', 'city', 'uf']
              }
            ]
          }
        ].filter(item => Boolean(item)) as Query[]
      }) as []

    return filteredKeypointersList.map(keypointer => ({
      accuracyInMeters: keypointer.accuracyInMeters,
      city: keypointer.city,
      direction: keypointer.direction,
      km: keypointer.km,
      marker: keypointer.marker,
      position: keypointer.position,
      rodId: keypointer.rodId,
      uf: keypointer.uf
    }))
  }

  async findByHighwayId(highwayId: number): Promise<KeyPointer[]> {
    const keyPointersList: KeyPointer[] =
      await this.dataMappingService.loadFromName(Filenames.KeyPointers)

    return keyPointersList.filter(({ rodId }) => rodId === highwayId)
  }

  async insertMany(pointers: Array<Partial<Pointer>>): Promise<boolean> {
    try {
      const keyPointersList = await this.dataMappingService.loadFromName(
        Filenames.KeyPointers
      )

      const newKeyPointersList = [...keyPointersList, ...pointers]

      await this.dataMappingService.saveCacheData(
        newKeyPointersList,
        Filenames.KeyPointers
      )

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
