import { SaveHighwayChanges } from './save-highway-changes'
import { describe, it, expect, beforeAll } from 'vitest'
import { Highway } from '../entities/highway'
import { makeHighwaysFactory } from '@/test/factories/make-highways-factory'
import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'

describe('Test save highway changes', () => {
  let inMemoryHighwaysRepository: InMemoryHighwaysRepository
  let saveHighwayChanges: SaveHighwayChanges

  beforeAll(() => {
    inMemoryHighwaysRepository = new InMemoryHighwaysRepository()
    saveHighwayChanges = new SaveHighwayChanges(inMemoryHighwaysRepository)
    inMemoryHighwaysRepository.values = makeHighwaysFactory()
  })

  it('should be save data with inject highway', async () => {
    const [firstInjectHighway] = inMemoryHighwaysRepository.values

    const modifiedHighway = {
      ...firstInjectHighway,
      code: 'TEST INJECT CODE',
      description: 'TEST INJECT DESCRIPTION'
    }

    await saveHighwayChanges.execute({
      highwayId: firstInjectHighway.id,
      highwayData: modifiedHighway
    })

    expect(inMemoryHighwaysRepository.values[0].code).toEqual(
      modifiedHighway.code
    )
    expect(inMemoryHighwaysRepository.values[0].description).toEqual(
      modifiedHighway.description
    )
  })

  it('should generate highwayId not provided or malformed error', () => {
    expect(
      saveHighwayChanges.execute({
        highwayId: 0,
        highwayData: {} as any
      })
    ).rejects.toThrowError('highwayId not provided or malformed')

    expect(
      saveHighwayChanges.execute({
        highwayId: null as any,
        highwayData: {} as any
      })
    ).rejects.toThrowError('highwayId not provided or malformed')

    expect(
      saveHighwayChanges.execute({
        highwayId: undefined as any,
        highwayData: {} as any
      })
    ).rejects.toThrowError('highwayId not provided or malformed')

    expect(
      saveHighwayChanges.execute({
        highwayId: '1' as any,
        highwayData: {} as any
      })
    ).rejects.toThrowError('highwayId not provided or malformed')

    expect(
      saveHighwayChanges.execute({
        highwayId: {} as any,
        highwayData: {} as any
      })
    ).rejects.toThrowError('highwayId not provided or malformed')
  })
})
