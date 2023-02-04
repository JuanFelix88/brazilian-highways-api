import { NextApiRequest, NextApiResponse } from 'next'
import type { Data as PartRod } from '../../../src/entities/part-rod'
import type { Highway } from '../../../src/entities/highway'
import dataJson from '../../../src/mapping/regis-bittencourt/data.json'
import { useEffect } from 'react'

const data = dataJson as PartRod[]

function adapterSearchFilter (q: string) {
  q = q.toLowerCase()
  return (item: PartRod, _: number) =>
    item.reference01.toLowerCase().includes(q) ||
    item.rod.toLowerCase().includes(q)
}

function adapterTransformDataToUniqueHighways (
  highways: Highway[],
  item: PartRod
) {
  if (!highways.some(highway => highway.name === item.rod)) {
    highways.push({
      id: (Math.random() * 100_000_000).toString(16),
      code: item.reference02.split(',')[0],
      description: 'Lorem episilum dolom',
      name: item.rod,
      link: '/regis-bittencourt'
    })
  }

  return highways
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(406).send('')
    }

    const { q } = req.query

    if (Array.isArray(q)) {
      return res.status(400).send("'q' malformed, try string content")
    }

    const highwaysTransformedFromListPartRod = data
      .filter(adapterSearchFilter(q ?? ''))
      .reduce<Highway[]>(adapterTransformDataToUniqueHighways, [])

    res.send(highwaysTransformedFromListPartRod)
  } catch (error) {
    res.status(501).send('')
  }
}
