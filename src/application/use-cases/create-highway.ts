import { Highway } from '../entities/highway'
import { HighwaysRepository } from '../repositories/highways-repository'

export namespace CreateHighway {
  export type Request = Omit<Highway, 'id'>

  export interface Response {
    id: number
  }
}

export class CreateHighway {
  constructor(private readonly highwaysRepository: HighwaysRepository) {}

  async execute({
    code,
    concessionaireLink,
    concessionaireName,
    emergencyContacts,
    hasConcessionaire,
    name,
    description
  }: CreateHighway.Request): Promise<CreateHighway.Response> {
    const { id } = await this.highwaysRepository.create({
      code,
      concessionaireLink,
      concessionaireName,
      hasConcessionaire,
      emergencyContacts,
      description,
      name
    })

    return {
      id
    }
  }
}
