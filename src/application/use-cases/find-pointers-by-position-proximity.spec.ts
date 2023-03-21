import { FindPointersByPositionProximity } from './find-pointers-by-position-proximity'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { makePointersFactory } from '@/test/factories/make-pointers-factory'

const VARIATION_LAT_LONG = 0.000612

describe('Test find pointers by position proximity', () => {
  let findPointersByPositionProximity: FindPointersByPositionProximity
  let inMemoryPointersRepository: InMemoryPointersRepository

  beforeAll(() => {
    inMemoryPointersRepository = new InMemoryPointersRepository()
    findPointersByPositionProximity = new FindPointersByPositionProximity(
      inMemoryPointersRepository
    )

    inMemoryPointersRepository.values = makePointersFactory(1)
  })

  it('should find specific pointer by position with some variation (150 meters)', async () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const positionWithVariation = firstInjectPointer.position.map(
      l => l + VARIATION_LAT_LONG
    ) as [number, number]

    const { pointers } = await findPointersByPositionProximity.execute({
      position: positionWithVariation,
      rayProximity: 150
    })

    expect(pointers).toHaveLength(1)
  })

  it('should generate no keypointer was found error because inject point position with variation with rayProximity not enough (50 meters)', () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const positionWithVariation = firstInjectPointer.position.map(
      l => l + VARIATION_LAT_LONG
    ) as [number, number]

    expect(
      findPointersByPositionProximity.execute({
        position: positionWithVariation,
        rayProximity: 50
      })
    ).rejects.toThrowError('no keypointer was found')
  })

  it('should generate position malformed, it needs to be a Lat Long position error', () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const positionWithVariation = firstInjectPointer.position
      .map(l => l + VARIATION_LAT_LONG)
      .map(l => l.toString())

    expect(
      findPointersByPositionProximity.execute({
        position: positionWithVariation as any,
        rayProximity: 50
      })
    ).rejects.toThrowError(
      'position malformed, it needs to be a Lat Long position'
    )
  })

  it('should generate rayProximity malformed or not provided error', () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const positionWithVariation = firstInjectPointer.position.map(
      l => l + VARIATION_LAT_LONG
    ) as [number, number]

    expect(
      findPointersByPositionProximity.execute({
        position: positionWithVariation,
        rayProximity: undefined as any
      })
    ).rejects.toThrowError('rayProximity malformed or not provided')
  })

  it('should find all pointers with ray proximity farm (10000 meters)', async () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values
    const itemsLength = inMemoryPointersRepository.values.length

    const positionWithVariation = firstInjectPointer.position.map(
      l => l + VARIATION_LAT_LONG
    ) as [number, number]

    const { pointers } = await findPointersByPositionProximity.execute({
      position: positionWithVariation,
      rayProximity: 10000
    })

    expect(pointers).toHaveLength(itemsLength)
  })
})
