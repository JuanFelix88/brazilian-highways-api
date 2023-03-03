import { HighwaysRepository } from '../repositories/highways-repository'

export namespace DeleteHighwayById {
  export interface Request {
    id: number
  }
}

export class DeleteHighwayById {
  constructor(private readonly highwaysRepository: HighwaysRepository) {}

  async execute({ id }: DeleteHighwayById.Request): Promise<void> {
    if (typeof id !== 'number') {
      throw new Error('`id` should be number')
    }

    await this.highwaysRepository.deleteById(id)
  }
}
