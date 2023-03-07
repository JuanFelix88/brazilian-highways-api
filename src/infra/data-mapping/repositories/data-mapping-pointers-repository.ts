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
        'uf',
        'id'
      ] as Array<keyof KeyPointer>,
      processTerm: term => removeAccents(term.toString().toLowerCase()),
      searchOptions: {
        processTerm: term => removeAccents(term.toString().toLowerCase())
      }
    })

    const hasHighwayId = !!highwayId
    const hasSearch = !!search

    miniSearch.addAll(keypointers)

    const filteredKeypointersList: Array<SearchResult & KeyPointer> =
      miniSearch.search({
        combineWith: 'AND',
        queries: [
          hasHighwayId && {
            queries: [highwayId.toString()],
            fields: ['rodId']
          },
          hasSearch && {
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
      uf: keypointer.uf,
      id: keypointer.id
    }))
  }

  async findByHighwayId(highwayId: number): Promise<KeyPointer[]> {
    const keyPointersList: KeyPointer[] =
      await this.dataMappingService.loadFromName(Filenames.KeyPointers)

    return keyPointersList.filter(({ rodId }) => rodId === highwayId)
  }

  async insertMany(pointers: Array<Partial<Pointer>>): Promise<boolean> {
    try {
      const keyPointersList: Array<KeyPointer & { id?: number }> =
        await this.dataMappingService.loadFromName(Filenames.KeyPointers)

      let computedId = 1
      const newKeyPointersList = (
        [...keyPointersList, ...pointers] as Array<KeyPointer & { id?: number }>
      ).map(keypointer =>
        Number.isInteger(keypointer.id)
          ? keypointer
          : { ...keypointer, id: computedId++ }
      )

      await this.dataMappingService.saveCacheData(
        newKeyPointersList,
        Filenames.KeyPointers
      )

      return true
    } catch (error) {
      return false
    }
  }

  async save(modifiedPointer: KilometerMarker & { id: number }): Promise<void> {
    const keypointers: Array<KeyPointer & { id: number }> =
      await this.dataMappingService.loadFromName(Filenames.KeyPointers)

    const hasKeypointer = keypointers.some(
      keypointer => keypointer.id === modifiedPointer.id
    )

    if (!hasKeypointer) {
      throw new Error("can't delete pointer because not found")
    }

    const modifiedPointersList = keypointers.map(keypointer =>
      keypointer.id === modifiedPointer.id ? modifiedPointer : keypointer
    )

    await this.dataMappingService.saveCacheData(
      modifiedPointersList,
      Filenames.KeyPointers
    )
  }

  async findById(keypointerId: number): Promise<KilometerMarker | null> {
    const keypointers: Array<KeyPointer & { id: number }> =
      await this.dataMappingService.loadFromName(Filenames.KeyPointers)

    return (
      keypointers.find(keypointer => keypointer.id === keypointerId) ?? null
    )
  }

  async deleteById(keypointerId: number): Promise<void> {
    const keypointers: Array<KeyPointer & { id: number }> =
      await this.dataMappingService.loadFromName(Filenames.KeyPointers)

    const hasKeypointer = keypointers.some(
      keypointer => keypointer.id === keypointerId
    )

    if (!hasKeypointer) {
      throw new Error("can't delete pointer because not found")
    }

    const modifiedPointersList = keypointers.filter(
      keypointer => keypointer.id !== keypointerId
    )

    await this.dataMappingService.saveCacheData(
      modifiedPointersList,
      Filenames.KeyPointers
    )
  }
}
