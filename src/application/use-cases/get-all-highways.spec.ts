import { GetAllHighways } from './get-all-highways'
import { describe, it, expect, beforeAll } from 'vitest'
import { Highway } from '../entities/highway'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { makeHighwaysFactory } from '@/test/factories/make-highways-factory'

describe('Test get all highways', () => {
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository
  let getAllHighways: GetAllHighways

  beforeAll(() => {
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    getAllHighways = new GetAllHighways(inMemoryHighwaysRepository)
    inMemoryHighwaysRepository.values = makeHighwaysFactory()
  })

  it('should get all highways and check data structure', async () => {
    const itemsLength = inMemoryHighwaysRepository.values.length
    const { highways } = await getAllHighways.execute()

    expect(highways).toHaveLength(itemsLength)

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
