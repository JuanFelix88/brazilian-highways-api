import { DeleteHighwayById } from './delete-highway-by-id'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { Highway } from '@/src/application/entities/highway'

describe('Test delete highway by id', () => {
  let deleteHighwayById: DeleteHighwayById
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository

  beforeAll(() => {
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    deleteHighwayById = new DeleteHighwayById(inMemoryHighwaysRepository)
  })

  it('should test effectiveness highways exclusion', async () => {
    const highway = {
      code: 'BR-143',
      description: 'Test highway description',
      emergencyContacts: '00000 0000 000',
      name: 'Test Highway Name',
      hasConcessionaire: false
    } satisfies Omit<Highway, 'id'>

    const { id: generateHighwayId } = await inMemoryHighwaysRepository.create({
      ...highway
    })

    expect(inMemoryHighwaysRepository.values[0].id).toEqual(generateHighwayId)

    await deleteHighwayById.execute({ id: generateHighwayId })

    expect(inMemoryHighwaysRepository.values).toHaveLength(0)
  })

  it('should be generate error because highway not found', async () => {
    expect(deleteHighwayById.execute({ id: 231284712 })).rejects.toThrowError(
      'highway not found'
    )
  })
})
