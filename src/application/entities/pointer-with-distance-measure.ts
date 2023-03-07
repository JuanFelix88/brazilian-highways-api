import { KilometerMarker } from './kilometer-marker'

export type PointerWithDistanceMeasure = KilometerMarker & {
  distanceMeasure: number
  measuredIn: 'meters' | 'kilometers'
}
