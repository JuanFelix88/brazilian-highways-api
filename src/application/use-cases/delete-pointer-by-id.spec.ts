import { DeletePointerById } from './delete-pointer-by-id'
import { describe, it, expect, beforeAll } from 'vitest'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { KeyPointer } from '../entities/key-pointer'

describe('Test delete pointer by id', () => {
  let deletePointerById: DeletePointerById
  let inMemoryPointersRepository: InMemoryPointersRepository

  beforeAll(() => {
    inMemoryPointersRepository = new InMemoryPointersRepository()
    deletePointerById = new DeletePointerById(inMemoryPointersRepository)
  })

  it('should delete pointer by existent pointer id', async () => {
    const pointer = {
      accuracyInMeters: 130,
      city: 'Tester City',
      direction: null,
      km: 901,
      marker: 99,
      position: [-23.586808645381826, -46.682250668482645],
      rodId: 24,
      uf: 'PR'
    } satisfies Omit<KeyPointer, 'id'>

    const { id: generatePointerId } = await inMemoryPointersRepository.create({
      ...pointer
    })

    expect(inMemoryPointersRepository.values[0].id).toEqual(generatePointerId)

    await deletePointerById.execute({
      keypointerId: generatePointerId
    })

    expect(inMemoryPointersRepository.values).toHaveLength(0)
  })

  it('should generate erro because pointer not found', () => {
    expect(
      deletePointerById.execute({ keypointerId: 4215 })
    ).rejects.toThrowError('pointer not found')
  })
})
