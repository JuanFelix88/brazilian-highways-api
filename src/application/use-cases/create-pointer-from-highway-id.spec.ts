import { CreatePointerFromHighwayId } from './create-pointer-from-highway-id'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { Highway } from '../entities/highway'
import { KeyPointer } from '../entities/key-pointer'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

describe('Test create pointer from highway id', () => {
  let createPointerFromHighwayIdUsecase: CreatePointerFromHighwayId
  let inMemoryPointersRepository: InMemoryPointersRepository
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository

  beforeAll(() => {
    inMemoryPointersRepository = new InMemoryPointersRepository()
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    createPointerFromHighwayIdUsecase = new CreatePointerFromHighwayId(
      inMemoryPointersRepository,
      inMemoryHighwaysRepository
    )
  })

  it('should be create pointer from existent highway', async () => {
    const highway = {
      code: 'BR-140',
      description: 'Testing description of highway',
      emergencyContacts: '0800 9090 23244',
      hasConcessionaire: false,
      id: 22,
      name: 'Test Name Highway'
    } satisfies Highway

    const { id: generateHighwayId } = await inMemoryHighwaysRepository.create(
      highway
    )

    const pointer = {
      accuracyInMeters: 130,
      city: 'City Test',
      direction: null,
      km: 422,
      marker: 9214,
      position: [-23.586808645381826, -46.682250668482645],
      uf: 'PR'
    } satisfies Omit<KeyPointer, 'id' | 'rodId'>

    const { id: generatePointerId } =
      await createPointerFromHighwayIdUsecase.execute({
        highwayId: generateHighwayId,
        pointer
      })

    expect(inMemoryPointersRepository?.values[0].id).toEqual(generatePointerId)
  })

  it('should emit error because highway not found', async () => {
    const pointer = {
      accuracyInMeters: 130,
      city: 'City Test',
      direction: null,
      km: 422,
      marker: 9214,
      position: [-23.586808645381826, -46.682250668482645],
      uf: 'PR'
    } satisfies Omit<KeyPointer, 'id' | 'rodId'>

    expect(
      async () =>
        await createPointerFromHighwayIdUsecase.execute({
          highwayId: 908098213,
          pointer
        })
    ).rejects.toThrowError('highway not found')
  })
})
