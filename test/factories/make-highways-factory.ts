import { Highway } from '@/src/application/entities/highway'

const highways: Highway[] = [
  {
    code: 'BR-101',
    description: 'Test description highway',
    emergencyContacts: '0800 9090 9014',
    hasConcessionaire: false,
    id: 1,
    name: 'BR-101'
  },
  {
    code: 'BR-102',
    description: 'Test description highway',
    emergencyContacts: '0800 9090 9014',
    hasConcessionaire: false,
    id: 2,
    name: 'BR-102'
  },
  {
    code: 'BR-103',
    description: 'Test description highway',
    emergencyContacts: '0800 9090 9014',
    hasConcessionaire: false,
    id: 3,
    name: 'BR-103'
  },
  {
    code: 'BR-104',
    description: 'Test description highway',
    emergencyContacts: '0800 9090 9014',
    hasConcessionaire: false,
    id: 4,
    name: 'BR-104'
  },
  {
    code: 'BR-105',
    description: 'Test description highway',
    emergencyContacts: '0800 9090 9014',
    hasConcessionaire: true,
    id: 5,
    name: 'BR-105',
    concessionaireLink: 'https://example.org',
    concessionaireName: 'Teste Concessionaire Name'
  },
  {
    code: 'BR-106',
    description: 'Test description highway',
    emergencyContacts: '0800 9090 9014',
    hasConcessionaire: true,
    id: 6,
    name: 'BR-106',
    concessionaireLink: 'https://example.org',
    concessionaireName: 'Teste Concessionaire Name'
  }
]

export function makeHighwaysFactory(): Highway[] {
  return highways
}
