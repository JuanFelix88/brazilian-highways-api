import { FindHighwayKeypointers } from './find-highway-keypointers'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { Highway } from '@/src/application/entities/highway'
import { makePointersFactory } from '@/test/factories/make-pointers-factory'
import keypointers from '@/pages/api/keypointers'
import { point } from 'leaflet'

describe('Test for find-highway-keypointers', () => {
  let findHighwayKeypointers: FindHighwayKeypointers
  let inMemoryPointersRepository: InMemoryPointersRepository
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository
  let highway: Highway

  beforeAll(async () => {
    highway = {
      code: 'BR-111',
      description: 'Description test',
      emergencyContacts: '0800 9090 1111',
      hasConcessionaire: false,
      id: 0,
      name: 'Test Highway'
    }

    inMemoryPointersRepository = new InMemoryPointersRepository()
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    findHighwayKeypointers = new FindHighwayKeypointers(
      inMemoryPointersRepository,
      inMemoryHighwaysRepository
    )

    const { id: generateHighwayId } = await inMemoryHighwaysRepository.create({
      ...highway
    })

    await inMemoryPointersRepository.insertMany(
      makePointersFactory(generateHighwayId)
    )

    highway.id = generateHighwayId
  })

  it('should find pointers by uf', async () => {
    const uf = 'PR'
    const { keypointers: fetchedByUfKeypointers } =
      await findHighwayKeypointers.execute({
        highwayId: highway.id,
        search: uf
      })

    for (const pointer of fetchedByUfKeypointers) {
      expect(pointer.rodId).toEqual(highway.id)
    }

    const lengthWithUf = inMemoryPointersRepository.values.filter(pointer =>
      pointer.uf.includes(uf)
    ).length

    expect(fetchedByUfKeypointers).toHaveLength(5)
  })

  it('should find pointers by city ', async () => {
    const city = 'Curitiba'
    const { keypointers: fetchedByUfKeypointers } =
      await findHighwayKeypointers.execute({
        highwayId: highway.id,
        search: city
      })

    for (const pointer of fetchedByUfKeypointers) {
      expect(pointer.rodId).toEqual(highway.id)
    }

    const lengthWithCityName = inMemoryPointersRepository.values.filter(
      pointer => pointer.city.includes(city)
    ).length

    expect(fetchedByUfKeypointers).toHaveLength(lengthWithCityName)
  })

  it('should generate error highway not found', async () => {
    expect(
      findHighwayKeypointers.execute({
        highwayId: -1,
        search: ''
      })
    ).rejects.toThrowError('highway not found')
  })

  it('should generate error highwayId not provided', async () => {
    expect(
      findHighwayKeypointers.execute({
        highwayId: undefined as any,
        search: ''
      })
    ).rejects.toThrowError('highwayId not provided')
  })
})
