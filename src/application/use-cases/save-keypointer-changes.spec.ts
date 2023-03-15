import { InMemoryHighwaysRepository } from '@/test/repositories/in-memory-highways-repository'
import { InMemoryPointersRepository } from '@/test/repositories/in-memory-pointers-repository'
import { beforeAll, describe, expect, it, test } from 'vitest'
import { KeyPointer } from '../entities/key-pointer'
import { SaveKeypointerChanges } from './save-keypointer-changes'

describe('Test save keypointer changes', () => {
  let inMemoryPointersRepository: InMemoryPointersRepository
  let saveKeypointerChanges: SaveKeypointerChanges

  beforeAll(() => {
    inMemoryPointersRepository = new InMemoryPointersRepository()
    saveKeypointerChanges = new SaveKeypointerChanges(
      inMemoryPointersRepository
    )
  })

  it('should be save data with existing keypointer', async () => {
    const keypointer = {
      accuracyInMeters: 150,
      city: 'Test City',
      uf: 'PR',
      direction: null,
      km: 25,
      marker: 24,
      position: [-24.512512, -48.21249012],
      rodId: 1
    } satisfies Omit<KeyPointer, 'id'>

    const { id: generatedKeypointerId } =
      await inMemoryPointersRepository.create({
        ...keypointer
      })

    const modifiedKeypointer = {
      ...keypointer,
      km: 462,
      uf: 'SP',
      id: generatedKeypointerId
    }

    await saveKeypointerChanges.execute({
      ...modifiedKeypointer
    })

    expect(inMemoryPointersRepository.values[0].accuracyInMeters).toBe(150)
    expect(inMemoryPointersRepository.values[0].uf).toBe('SP')
    expect(inMemoryPointersRepository.values[0].km).toBe(462)
    expect(inMemoryPointersRepository.values[0].id).toBe(generatedKeypointerId)
  })

  it('should not save data because pointer not found', () => {
    const keypointer = {
      accuracyInMeters: 150,
      city: 'Test City',
      uf: 'PR',
      direction: null,
      km: 25,
      marker: 24,
      position: [-24.512512, -48.21249012],
      rodId: 1,
      id: 52
    } satisfies KeyPointer

    const modifiedKeypointer = {
      ...keypointer,
      km: 462,
      uf: 'SP'
    }

    expect(
      async () =>
        await saveKeypointerChanges.execute({
          ...modifiedKeypointer
        })
    ).rejects.toThrowError(/pointer not found/)
  })

  it('should not save data because pointer not found', () => {
    const keypointer = {
      accuracyInMeters: 150,
      city: 'Test City',
      uf: 'PR',
      direction: null,
      km: 25,
      marker: 24,
      position: [-24.512512, -48.21249012],
      rodId: 1,
      id: 52
    } satisfies KeyPointer

    const modifiedKeypointer = {
      ...keypointer,
      km: 462,
      uf: 'SP'
    }

    expect(
      async () =>
        await saveKeypointerChanges.execute({
          ...modifiedKeypointer
        })
    ).rejects.toThrowError(/pointer not found/)
  })
})
