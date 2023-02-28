import { KeyPointer } from '@/src/application/entities/key-pointer'
import { Pointer } from '@/src/application/entities/pointer'
import { PointersRepository } from '@/src/application/repositories/pointers-repository'
import { DataMappingService, Filenames } from '../data-mapping.service'

export class DataMappingPointersRepository implements PointersRepository {
  constructor(private readonly dataMappingService: DataMappingService) {}

  async create(highway: Partial<Pointer>): Promise<{ id: number }> {}

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
