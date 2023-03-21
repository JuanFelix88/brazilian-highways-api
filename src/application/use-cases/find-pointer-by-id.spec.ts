import { FindPointerById } from './find-pointer-by-id'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { KeyPointer } from '@/src/application/entities/key-pointer'
import { makePointersFactory } from '@/test/factories/make-pointers-factory'

describe('Test find pointer by id', () => {
  let findPointerById: FindPointerById
  let inMemoryPointersRepository: InMemoryPointersRepository

  beforeAll(() => {
    inMemoryPointersRepository = new InMemoryPointersRepository()
    findPointerById = new FindPointerById(inMemoryPointersRepository)
    inMemoryPointersRepository.values = makePointersFactory(1)
  })

  it('should find existent injected pointer and checks data structure', async () => {
    const injectedId = inMemoryPointersRepository.values[0].id

    const pointer = await findPointerById.execute(injectedId)

    expect(pointer.accuracyInMeters).toEqual(
      inMemoryPointersRepository.values[0].accuracyInMeters
    )
    expect(pointer.city).toEqual(inMemoryPointersRepository.values[0].city)
    expect(pointer.direction).toEqual(
      inMemoryPointersRepository.values[0].direction
    )
    expect(pointer.id).toEqual(inMemoryPointersRepository.values[0].id)
    expect(pointer.km).toEqual(inMemoryPointersRepository.values[0].km)
    expect(pointer.marker).toEqual(inMemoryPointersRepository.values[0].marker)
    expect(pointer.position).toEqual(
      inMemoryPointersRepository.values[0].position
    )
    expect(pointer.rodId).toEqual(inMemoryPointersRepository.values[0].rodId)
    expect(pointer.uf).toEqual(inMemoryPointersRepository.values[0].uf)
  })

  it('should generate error pointerId malformed or not provided', () => {
    expect(findPointerById.execute('' as any)).rejects.toThrowError(
      'pointerId malformed or not provided'
    )

    expect(findPointerById.execute(false as any)).rejects.toThrowError(
      'pointerId malformed or not provided'
    )

    expect(findPointerById.execute({} as any)).rejects.toThrowError(
      'pointerId malformed or not provided'
    )

    expect(findPointerById.execute([] as any)).rejects.toThrowError(
      'pointerId malformed or not provided'
    )

    expect(findPointerById.execute(null as any)).rejects.toThrowError(
      'pointerId malformed or not provided'
    )
  })

  it('should generate error pointer not found', () => {
    expect(findPointerById.execute(0)).rejects.toThrowError('pointer not found')

    expect(findPointerById.execute(-1)).rejects.toThrowError(
      'pointer not found'
    )
  })
})
