import { KeyPointer } from '@/src/application/entities/key-pointer'

const pointers: KeyPointer[] = [
  {
    accuracyInMeters: 133,
    city: 'Curitiba',
    direction: null,
    id: 2131,
    km: 22,
    marker: 21,
    position: [-23.14442, -44.1234],
    rodId: 0,
    uf: 'PR'
  },
  {
    accuracyInMeters: 133,
    city: 'Curitiba',
    direction: null,
    id: 4215,
    km: 23,
    marker: 22,
    position: [-23.14442, -44.1234],
    rodId: 0,
    uf: 'PR'
  },
  {
    accuracyInMeters: 133,
    city: 'Curitiba',
    direction: null,
    id: 1114,
    km: 24,
    marker: 23,
    position: [-23.14442, -44.1234],
    rodId: 0,
    uf: 'PR'
  },
  {
    accuracyInMeters: 133,
    city: 'Campina Grande do Sul',
    direction: null,
    id: 25412,
    km: 25,
    marker: 24,
    position: [-23.14442, -44.1234],
    rodId: 0,
    uf: 'PR'
  },
  {
    accuracyInMeters: 133,
    city: 'Campina Grande do Sul',
    direction: null,
    id: 7751,
    km: 26,
    marker: 25,
    position: [-23.14442, -44.1234],
    rodId: 0,
    uf: 'PR'
  }
]

export function makePointersFactory(highwayId: number): KeyPointer[] {
  return pointers.map(pointer => ({ ...pointer, rodId: highwayId }))
}
