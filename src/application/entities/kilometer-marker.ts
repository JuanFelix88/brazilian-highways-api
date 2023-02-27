export interface KilometerMarker {
  rodId: number
  marker: number
  km: number
  position: [number, number]
  city: string
  uf: string
  direction: string | null
  accuracyInMeters: number
}
