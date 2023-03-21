import { FindPointers } from './find-pointers'
import { describe, it, expect, beforeAll, expectTypeOf } from 'vitest'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { makePointersFactory } from '@/test/factories/make-pointers-factory'

const HIGHWAY_ID = 1

describe('Test find pointers', () => {
  let inMemoryPointersRepository: InMemoryPointersRepository
  let findPointers: FindPointers

  beforeAll(() => {
    inMemoryPointersRepository = new InMemoryPointersRepository()
    findPointers = new FindPointers(inMemoryPointersRepository)

    inMemoryPointersRepository.values = makePointersFactory(HIGHWAY_ID)
  })

  it('should find first inject pointer by km string and check data structure is equal', async () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const { pointers } = await findPointers.execute({
      search: firstInjectPointer.km.toString()
    })

    const [firstFetchedPointer] = pointers

    expect(firstFetchedPointer.accuracyInMeters).toEqual(
      firstFetchedPointer.accuracyInMeters
    )
    expect(firstFetchedPointer.city).toEqual(firstFetchedPointer.city)
    expect(firstFetchedPointer.direction).toEqual(firstFetchedPointer.direction)
    expect(firstFetchedPointer.id).toEqual(firstFetchedPointer.id)
    expect(firstFetchedPointer.km).toEqual(firstFetchedPointer.km)
    expect(firstFetchedPointer.marker).toEqual(firstFetchedPointer.marker)
    expect(firstFetchedPointer.position).toEqual(firstFetchedPointer.position)
    expect(firstFetchedPointer.rodId).toEqual(firstFetchedPointer.rodId)
    expect(firstFetchedPointer.uf).toEqual(firstFetchedPointer.uf)
  })

  it('should find first inject pointer by city and check data structure is equal', async () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const { pointers } = await findPointers.execute({
      search: firstInjectPointer.city
    })

    const [firstFetchedPointer] = pointers

    expect(firstFetchedPointer.accuracyInMeters).toEqual(
      firstFetchedPointer.accuracyInMeters
    )
    expect(firstFetchedPointer.city).toEqual(firstFetchedPointer.city)
    expect(firstFetchedPointer.direction).toEqual(firstFetchedPointer.direction)
    expect(firstFetchedPointer.id).toEqual(firstFetchedPointer.id)
    expect(firstFetchedPointer.km).toEqual(firstFetchedPointer.km)
    expect(firstFetchedPointer.marker).toEqual(firstFetchedPointer.marker)
    expect(firstFetchedPointer.position).toEqual(firstFetchedPointer.position)
    expect(firstFetchedPointer.rodId).toEqual(firstFetchedPointer.rodId)
    expect(firstFetchedPointer.uf).toEqual(firstFetchedPointer.uf)
  })

  it('should find first inject pointer by uf and check data structure is equal', async () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values

    const { pointers } = await findPointers.execute({
      search: firstInjectPointer.uf
    })

    const [firstFetchedPointer] = pointers

    expect(firstFetchedPointer.accuracyInMeters).toEqual(
      firstFetchedPointer.accuracyInMeters
    )
    expect(firstFetchedPointer.city).toEqual(firstFetchedPointer.city)
    expect(firstFetchedPointer.direction).toEqual(firstFetchedPointer.direction)
    expect(firstFetchedPointer.id).toEqual(firstFetchedPointer.id)
    expect(firstFetchedPointer.km).toEqual(firstFetchedPointer.km)
    expect(firstFetchedPointer.marker).toEqual(firstFetchedPointer.marker)
    expect(firstFetchedPointer.position).toEqual(firstFetchedPointer.position)
    expect(firstFetchedPointer.rodId).toEqual(firstFetchedPointer.rodId)
    expect(firstFetchedPointer.uf).toEqual(firstFetchedPointer.uf)
  })

  it('should find all items by uf signed', async () => {
    const [firstInjectPointer] = inMemoryPointersRepository.values
    const itemsLength = inMemoryPointersRepository.values.length

    const { pointers } = await findPointers.execute({
      search: firstInjectPointer.uf
    })

    expect(pointers).toHaveLength(itemsLength)
  })

  it('should generate no keypointer was found error', () => {
    expect(findPointers.execute({ search: '$$$' })).rejects.toThrowError(
      'no keypointer was found'
    )
    expect(findPointers.execute({ search: 'asfas$$$' })).rejects.toThrowError(
      'no keypointer was found'
    )
  })
})
