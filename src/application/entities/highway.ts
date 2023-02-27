export interface Highway {
  id: number
  name: string
  description: string
  code: string
  hasConcessionaire: boolean
  concessionaireName?: string
  emergencyContacts: string
  concessionaireLink?: string
}
