import { InMemoryHighwaysRepository } from './../../../test/repositories/in-memory-highways-repository'
import { FindHighwayById } from './find-highway-by-id'
import { describe, it, expect, beforeAll } from 'vitest'
import { Highway } from '../entities/highway'

describe('Test find highway by id', () => {
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository
  let findHighwayById: FindHighwayById

  beforeAll(() => {
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    findHighwayById = new FindHighwayById(inMemoryHighwaysRepository)
  })

  it('should find existent highway', async () => {
    const highway = {
      code: 'BR-001',
      description: 'A simple description highway',
      emergencyContacts: '0800 9004 120',
      hasConcessionaire: false,
      name: 'BR-001 testing'
    } satisfies Omit<Highway, 'id'>

    const { id: generatedHighwayId } = await inMemoryHighwaysRepository.create({
      ...highway
    })

    const { highway: highwayFetched } = await findHighwayById.execute({
      id: generatedHighwayId
    })

    expect(highwayFetched.code).toEqual(highway.code)
    expect(highwayFetched.description).toEqual(highway.description)
    expect(highwayFetched.emergencyContacts).toEqual(highway.emergencyContacts)
    expect(highwayFetched.hasConcessionaire).toEqual(highway.hasConcessionaire)
    expect(highwayFetched.name).toEqual(highway.name)
  })

  it('should generate error highway not found', async () => {
    expect(
      findHighwayById.execute({
        id: 2314805
      })
    ).rejects.toThrowError('highway not found')
  })
})
