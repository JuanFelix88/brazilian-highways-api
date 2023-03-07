interface Options {
  /** @default 'meters' */
  measure?: 'meters' | 'kilometers'
}

type Position = [number, number]

const EARTH_RADIUS_IN_KILOMETERS = 6_371
const ONE_KILOMETER_IN_METERS = 1_000

function calculeCrow([lat1, lon1]: Position, [lat2, lon2]: Position): number {
  const distanceLat = toRad(lat2 - lat1)
  const distanceLong = toRad(lon2 - lon1)
  const radLat1 = toRad(lat1)
  const radLat2 = toRad(lat2)

  const result1 =
    Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
    Math.sin(distanceLong / 2) *
      Math.sin(distanceLong / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2)
  const result2 = 2 * Math.atan2(Math.sqrt(result1), Math.sqrt(1 - result1))
  const distance = EARTH_RADIUS_IN_KILOMETERS * result2
  return distance
}

// Converts numeric degrees to radians
function toRad(Value: number) {
  return (Value * Math.PI) / 180
}

export function getProximityBetwenPositions(
  a: Position,
  b: Position,
  { measure = 'meters' }: Options
): number {
  const distance = calculeCrow(a, b)
  return measure === 'meters' ? distance * ONE_KILOMETER_IN_METERS : distance
}
