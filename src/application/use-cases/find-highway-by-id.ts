import { Highway } from '../entities/highway'
import { HighwaysRepository } from '../repositories/highways-repository'

export namespace FindHighwayById {
  export interface Request {
    id: number
  }

  export interface Response {
    highway: Highway
  }
}

export class FindHighwayById {
  constructor(private readonly highwaysRepository: HighwaysRepository) {}

  async execute({
    id
  }: FindHighwayById.Request): Promise<FindHighwayById.Response> {
    if (typeof id !== 'number') {
      throw new Error('`id` should be number')
    }

    const highway = await this.highwaysRepository.findById(id)

    if (!highway) {
      throw new Error('highway not found')
    }

    return {
      highway
    }
  }
}
