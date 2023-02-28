import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { beforeAll, describe, expect, it } from 'vitest'
import { KeyPointer } from '../entities/key-pointer'
import { SavePointersFromHighwayId } from './save-pointers-from-highway-id'

describe('Test save pointers from highway id', () => {
  const inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
  const inMemoryPointersRepository = new InMemoryPointersRepository()
  const savePointersFromHighwayId = new SavePointersFromHighwayId(
    inMemoryPointersRepository,
    inMemoryHighwaysRepository
  )

  beforeAll(async () => {
    await inMemoryHighwaysRepository.create({
      code: 'BR-100',
      concessionaireName: 'Test',
      description: 'Test Description',
      hasConcessionaire: true,
      name: 'Rod Test'
    })
  })

  it('should be save data', async () => {
    const [{ id: highwayId }] = inMemoryHighwaysRepository.values

    const mockPointers: KeyPointer[] = [
      {
        accuracyInMeters: 20,
        city: 'City Name',
        direction: 'Anywhere',
        km: 0,
        marker: 0,
        position: [0, 0],
        rodId: highwayId,
        uf: 'PR'
      },
      {
        accuracyInMeters: 20,
        city: 'City Name',
        direction: 'Anywhere',
        km: 1,
        marker: 1,
        position: [0, 0],
        rodId: highwayId,
        uf: 'PR'
      }
    ]

    const result = await savePointersFromHighwayId.execute({
      highwayId,
      pointers: mockPointers
    })

    expect(result).toBeTruthy()
    expect(inMemoryPointersRepository.values).toHaveLength(2)
    expect(inMemoryPointersRepository.values[0]?.km).toBe(0)
    expect(inMemoryPointersRepository.values[1]?.km).toBe(1)
  })
})
