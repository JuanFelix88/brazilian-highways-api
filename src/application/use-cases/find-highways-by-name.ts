import { Highway } from '../entities/highway'
import { HighwaysRepository } from '../repositories/highways-repository'

namespace FindHighwaysByName {
  export interface Request {
    highwayName: string
  }

  export interface Response {
    highways: Highway[]
  }
}

export class FindHighwaysByName {
  constructor(private readonly highwaysRepository: HighwaysRepository) {}

  async execute({
    highwayName
  }: FindHighwaysByName.Request): Promise<FindHighwaysByName.Response> {
    if (!highwayName) {
      throw new Error(`highwayName not provided for search`)
    }

    const highwaysFetchedByName = await this.highwaysRepository.findByName(
      highwayName
    )

    if (highwaysFetchedByName.length === 0) {
      throw new Error('No highway was found')
    }

    return {
      highways: highwaysFetchedByName
    }
  }
}
