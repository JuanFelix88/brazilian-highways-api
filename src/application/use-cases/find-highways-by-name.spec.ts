import { FindHighwaysByName } from './find-highways-by-name'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { makeHighwaysFactory } from '@/test/factories/make-highways-factory'

describe('Test find highways by name', () => {
  let findHighwaysByName: FindHighwaysByName
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository

  beforeAll(() => {
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    findHighwaysByName = new FindHighwaysByName(inMemoryHighwaysRepository)
    inMemoryHighwaysRepository.values = makeHighwaysFactory()
  })

  it('should find existent highway inject with name', async () => {
    const [firstRecord] = inMemoryHighwaysRepository.values

    const { highways } = await findHighwaysByName.execute({
      highwayName: firstRecord.name
    })

    expect(highways).toHaveLength(1)
    expect(highways[0].code).toEqual(firstRecord.code)
  })

  it('should generate error highwayName not provided for search', () => {
    expect(
      findHighwaysByName.execute({
        highwayName: ''
      })
    ).rejects.toThrowError('highwayName not provided for search')

    expect(
      findHighwaysByName.execute({
        highwayName: null as any
      })
    ).rejects.toThrowError('highwayName not provided for search')

    expect(
      findHighwaysByName.execute({
        highwayName: undefined as any
      })
    ).rejects.toThrowError('highwayName not provided for search')
  })

  it('should generate error no highway was found', () => {
    expect(
      findHighwaysByName.execute({
        highwayName: '$'
      })
    ).rejects.toThrowError('no highway was found')
  })

  it('should find all items based on suffix signed in all names', async () => {
    inMemoryHighwaysRepository.values = makeHighwaysFactory()

    const { highways } = await findHighwaysByName.execute({
      highwayName: 'BR'
    })

    expect(highways).toHaveLength(inMemoryHighwaysRepository.values.length)
  })

  it('should generatate data with all highway fields', async () => {
    inMemoryHighwaysRepository.values = makeHighwaysFactory()

    const { highways } = await findHighwaysByName.execute({
      highwayName: 'BR'
    })

    for (const highway of highways) {
      expect(/^[A-Z]{2}-[0-9]{3}$/.test(highway.code)).toBeTruthy()
      expect(typeof highway.name).toEqual('string')
      expect(typeof highway.description).toEqual('string')
      expect(typeof highway.emergencyContacts).toEqual('string')
      expect(typeof highway.id).toEqual('number')
      expect(typeof highway.hasConcessionaire).toEqual('boolean')
      if (highway.hasConcessionaire) {
        expect(/^https:\/\//.test(highway.concessionaireLink!)).toBeTruthy()
        expect(typeof highway.concessionaireName).toEqual('string')
      }
    }
  })
})
