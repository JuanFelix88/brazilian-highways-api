import { Highway } from '../entities/highway'
import { HighwaysRepository } from '../repositories/highways-repository'

export namespace SaveHighwayChanges {
  export interface Request {
    highwayId: number
    highwayData: Omit<Highway, 'id'>
  }
}

export class SaveHighwayChanges {
  constructor(private readonly highwaysRepository: HighwaysRepository) {}

  async execute({
    highwayId: id,
    highwayData: {
      code,
      description,
      emergencyContacts,
      hasConcessionaire,
      name,
      concessionaireLink,
      concessionaireName
    }
  }: SaveHighwayChanges.Request): Promise<void> {
    if (!id || typeof id !== 'number' || isNaN(id)) {
      throw new Error('highwayId not provided or malformed')
    }

    await this.highwaysRepository.save({
      code,
      description,
      emergencyContacts,
      hasConcessionaire,
      id,
      name,
      concessionaireLink,
      concessionaireName
    })
  }
}
