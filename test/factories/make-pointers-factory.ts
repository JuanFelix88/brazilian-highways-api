import { KeyPointer } from '@/src/application/entities/key-pointer'

const pointers: KeyPointer[] = [
  {
    accuracyInMeters: 133,
    city: 'Curitiba',
    direction: null,
    id: 2131,
    km: 22,
    marker: 21,
    position: [-25.519864, -48.543768],
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
    position: [-25.527693, -48.547637],
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
    position: [-25.534421219456927, -48.55378969468281],
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
    position: [-25.541805, -48.559019],
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
    position: [-25.550453, -48.561377],
    rodId: 0,
    uf: 'PR'
  }
]

export function makePointersFactory(highwayId: number): KeyPointer[] {
  return pointers.map(pointer => ({ ...pointer, rodId: highwayId }))
}
