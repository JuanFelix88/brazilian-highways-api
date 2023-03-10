import { Highway } from '../entities/highway'
import { HighwaysRepository } from '../repositories/highways-repository'

namespace GetAllHighways {
  export interface Response {
    highways: Highway[]
  }
}

export class GetAllHighways {
  constructor(private readonly highwaysRepository: HighwaysRepository) {}

  async execute(): Promise<GetAllHighways.Response> {
    const highways = await this.highwaysRepository.getAll()

    return {
      highways: highways.map(highway => ({
        code: highway.code,
        description: highway.description,
        emergencyContacts: highway.emergencyContacts,
        hasConcessionaire: highway.hasConcessionaire,
        id: highway.id,
        name: highway.name,
        concessionaireLink: highway.concessionaireLink,
        concessionaireName: highway.concessionaireName
      }))
    }
  }
}
