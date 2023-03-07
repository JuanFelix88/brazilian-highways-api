import { PointersRepository } from '../repositories/pointers-repository'

export namespace DeletePointerById {
  export interface Request {
    keypointerId: number
  }
  export type Response = undefined
}

export class DeletePointerById {
  constructor(private readonly pointersRepository: PointersRepository) {}

  async execute({ keypointerId }: DeletePointerById.Request): Promise<void> {
    try {
      if (typeof keypointerId !== 'number') {
        throw new Error('keypointerId malformed or not provided')
      }

      await this.pointersRepository.deleteById(keypointerId)
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "can't delete pointer because not found"
      ) {
        throw new Error('pointer not found')
      }

      throw err
    }
  }
}
