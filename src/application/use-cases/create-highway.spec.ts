import { CreateHighway } from './create-highway'
import { beforeAll, describe, expect, it, test } from 'vitest'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { Highway } from '@/src/application/entities/highway'

describe('Test create highway', () => {
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository
  let createHighway: CreateHighway

  beforeAll(() => {
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    createHighway = new CreateHighway(inMemoryHighwaysRepository)
  })

  it('should be to create highway with simple data', async () => {
    const highway = {
      code: 'BR-001',
      description: 'A simple description highway',
      emergencyContacts: '0800 9004 120',
      hasConcessionaire: false,
      name: 'BR-001 testing'
    } satisfies Omit<Highway, 'id'>

    const { id: generatedHighwayId } = await createHighway.execute(highway)

    expect(inMemoryHighwaysRepository.values[0].code).toEqual(highway.code)
    expect(inMemoryHighwaysRepository.values[0].description).toEqual(
      highway.description
    )
    expect(inMemoryHighwaysRepository.values[0].emergencyContacts).toEqual(
      highway.emergencyContacts
    )
    expect(inMemoryHighwaysRepository.values[0].hasConcessionaire).toEqual(
      highway.hasConcessionaire
    )
    expect(inMemoryHighwaysRepository.values[0].name).toEqual(highway.name)
    expect(inMemoryHighwaysRepository.values[0].id).toEqual(generatedHighwayId)
  })
})
