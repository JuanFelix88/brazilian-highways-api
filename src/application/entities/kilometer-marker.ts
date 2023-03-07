export interface KilometerMarker {
  id: number
  rodId: number
  marker: number
  km: number
  position: [number, number]
  city: string
  uf: string
  direction: string | null
  accuracyInMeters: number
}
