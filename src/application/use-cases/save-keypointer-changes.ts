import { KeyPointer } from '../entities/key-pointer'
import { PointersRepository } from '../repositories/pointers-repository'

namespace SaveKeypointerChanges {
  export type Request = KeyPointer & { id: number }
}

export class SaveKeypointerChanges {
  constructor(private readonly pointersRepository: PointersRepository) {}

  async execute({
    accuracyInMeters,
    city,
    direction,
    km,
    marker,
    position,
    rodId,
    uf,
    id
  }: SaveKeypointerChanges.Request): Promise<void> {
    await this.pointersRepository.save({
      accuracyInMeters,
      city,
      direction,
      km,
      marker,
      position,
      rodId,
      uf,
      id
    })
  }
}
