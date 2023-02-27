import { hashUglifier } from './has-uglifier'

export const uglifyMap = {
  keys: {
    id: hashUglifier.substring(0, 45),
    name: hashUglifier.substring(55, 90),
    rod: hashUglifier.substring(105, 150),
    cityUf: hashUglifier.substring(151, 190),
    link: hashUglifier.substring(46, 54),
    position: hashUglifier.substring(230, 246),
    km: hashUglifier.substring(250, 330)
  },
  separators: {
    keys: hashUglifier.substring(200, 215),
    items: hashUglifier.substring(215, 305)
  }
}

export function toUglifyData(data: any[]) {
  return data
    .map(item => {
      return Object.entries(item)
        .map(
          ([key, value]) =>
            `${uglifyMap.keys[key as keyof typeof uglifyMap.keys]}${
              value as string
            }`
        )
        .join(uglifyMap.separators.keys)
    })
    .join(uglifyMap.separators.items)
}

function getValueType(code: string) {
  return Object.entries(uglifyMap.keys).find(([, key]) =>
    code.includes(key)
  )?.[0]
}

function removeValueType(code: string) {
  const typeCode = Object.entries(uglifyMap.keys).find(([, key]) =>
    code.includes(key)
  )?.[1]

  return code.replace(typeCode!, '')
}

export function unUglifyData(code: string) {
  const items = code.split(uglifyMap.separators.items)

  return items
    .filter(item => (item?.length ?? 0) > 0)
    .map(item => {
      const obj: any = {}

      item
        .split(uglifyMap.separators.keys)
        .filter(fieldAndData => (fieldAndData?.length ?? 0) > 0)
        .forEach(fieldAndData => {
          obj[getValueType(fieldAndData)!] = removeValueType(fieldAndData)
        })

      return obj
    })
}
