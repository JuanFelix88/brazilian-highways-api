import { Highway } from '@/src/application/entities/highway'
import { HighwayValidationError } from '@/src/application/use-cases/errors/highway-validation-error'

export function createHighwayBody({
  code,
  concessionaireLink,
  concessionaireName,
  description,
  emergencyContacts,
  hasConcessionaire,
  name
}: Omit<Highway, 'id'>) {
  try {
    if (!/^[A-Z]{2}-[0-9]{2,}$/.test(code)) {
      throw new TypeError(
        `The type of 'code' content is not allowed, try something like 'BR-100'`
      )
    }

    if (!name) {
      throw new Error(`The 'name' not provided`)
    }

    if (name.length <= 3) {
      throw new TypeError(
        `The 'name' does not contain the minimum number of characters (4)`
      )
    }

    if (!description?.length) {
      throw new Error(`The 'description' not provided`)
    }

    if (description.length <= 3) {
      throw new TypeError(
        `The 'description' does not contain the minimum number of characters (4)`
      )
    }

    if (!emergencyContacts) {
      throw new Error(`The 'emergencyContacts' not provided`)
    }

    if (hasConcessionaire && !concessionaireName) {
      throw new Error(`The 'concessionaireName' not provided'`)
    }

    if (hasConcessionaire && !concessionaireLink) {
      throw new Error(`The 'concessionaireLink' not provided'`)
    }

    if (concessionaireLink && !/^http(s)?:\/\/.*$/.test(concessionaireLink)) {
      throw new TypeError(`The type of link 'concessionaireLink' is invalid`)
    }

    return {
      code,
      concessionaireLink,
      concessionaireName,
      description,
      emergencyContacts,
      hasConcessionaire,
      name
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new HighwayValidationError(error.message)
    }

    throw error
  }
}
