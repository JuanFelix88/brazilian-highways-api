import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import absData from '../../../../src/mapping/abs.json'

interface RawTrafficDrive {
  authenticationResultCode: 'ValidCredentials' | string
  brandLogoUri: 'http://dev.virtualearth.net/Branding/logo_powered_by.png'
  copyright: 'Copyright © 2023 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.'
  resourceSets: [
    {
      estimatedTotal: 1
      resources: [
        {
          __type: 'Route:http://schemas.microsoft.com/search/local/ws/rest/v1'
          bbox: [number, number, number, number]
          id: string
          distanceUnit: 'Kilometer'
          durationUnit: 'Second'
          routeInfoHint: {
            hintPoint: {
              type: 'Point'
              coordinates: [-25.196329, -48.891891]
            }
            orientation: 'Left'
          }
          routeLegs: any[]
          routePath: {
            annotations: Array<{
              index: number
              traffic: string
            }>
            generalizations: []
            line: {
              type: 'LineString'
              coordinates: Array<[number, number]>
            }
          }
          trafficCongestion: string
          trafficDataUsed: string
          travelDistance: number
          travelDuration: number
          travelDurationTraffic: number
          travelMode: 'Driving'
        }
      ]
    }
  ]
  statusCode: 200 | 400 | 500
  statusDescription: 'OK' | string
  traceId: '09709cfbea0043d4aecb722a9ff4f99a|BN0000640F|0.0.0.0|BN0000185B, Leg0-BN00003764, Leg0-BN00002ADE'
}

const PARALLELISM_FETCH_POINTERS = 3
let REQUESTS_COUNT = 0
let ERRORS_COUNT = 0
let SUCCESS_COUNT = 0

interface Pointer {
  km: number
  position: [number, number]
}

async function requestTrafficDrive({ origin = [0, 0], destiny = [0, 0] }) {
  try {
    const path = [
      '/REST/v1/Routes/alternate?key=AuaGMW-oq8sajeob-kGFW_aFgxYGP9UKiPnGA5PHFuQiUIrn80XgpdPvyPL7M_6_',
      '&o=json&jsonp=Microsoft.Maps.NetworkCallbacks.ffa7d3&fi=true&errorDetail=true&ur=br&c=pt-BR',
      `&wp.0=${origin.join(',')}[Brasil]`,
      `&wp.1=${destiny.join(',')}[Brasil]`,
      '&ig=true&ra=routepath,routepathannotations,routeproperties,transitStops,includeCameras,routeInfoCard,TransitFrequency&lm=driving,transit&cn=parkandrides',
      '&optmz=timeAvoidClosure&du=km&tt=departure&maxSolns=4&rpo=Points'
    ].join('')

    const fetchTrafficDrive = await fetch(
      `https://dev.virtualearth.net${path}`,
      {
        headers: {
          accept: '*/*',
          'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'sec-ch-ua':
            '"Not_A Brand";v="99", "Microsoft Edge";v="109", "Chromium";v="109"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Linux"',
          'sec-fetch-dest': 'script',
          origin: 'https://www.bing.com'
        },
        referrer: 'https://www.bing.com/',
        referrerPolicy: 'origin-when-cross-origin',
        body: null,
        method: 'GET'
      }
    )

    REQUESTS_COUNT++

    console.log('\n\n--- NEW REQUEST ----')
    console.log(fetchTrafficDrive.status)
    console.log(fetchTrafficDrive.url)
    console.log('\n--- BODY ----')
    const rawBody = await fetchTrafficDrive.text()
    const rawJson = /^Microsoft.Maps.NetworkCallbacks.ffa7d3\((.*)\)$/.exec(
      rawBody
    )?.[1]

    if (rawJson === undefined) {
      throw new Error(`Content Error: '${rawBody}'`)
    }

    const trafficDriveData: RawTrafficDrive = JSON.parse(rawJson)

    if (trafficDriveData.authenticationResultCode !== 'ValidCredentials') {
      throw new Error(trafficDriveData.authenticationResultCode)
    }

    SUCCESS_COUNT++
    return trafficDriveData
  } catch (error) {
    ERRORS_COUNT++
    console.log(error)
    return null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pointers: Pointer[] = []
  const actualKm = 0
  const basePointer = [-25.0597402, -48.5620091]

  const rawPositionsList = absData.slice(0, 10)

  const path = [
    '/REST/v1/Routes/alternate?key=ArSISHTQXsCvibvanDm37ycN91JR4_N7gBIc0gDa21XKxGSYv9FjI_MSs-OrKhtS',
    '&o=json&jsonp=Microsoft.Maps.NetworkCallbacks.f75983&fi=true&errorDetail=true&ur=br&c=pt-BR',
    `&wp.0=${basePointer.join(',')}[Brasil]`,
    `&wp.1=${[-25.059617, -48.561665].join(',')}[Brasil]`,
    '&ig=true&ra=routepath,routepathannotations,routeproperties,transitStops,includeCameras,routeInfoCard,TransitFrequency&lm=driving,transit&cn=parkandrides',
    '&optmz=timeAvoidClosure&du=km&tt=departure&maxSolns=4&rpo=Points'
  ].join('')

  const response = await axios.get(`https://dev.virtualearth.net${path}`, {
    headers: {
      accept: '*/*',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'sec-ch-ua':
        '"Not_A Brand";v="99", "Microsoft Edge";v="109", "Chromium";v="109"',
      'sec-ch-ua-platform': '"Linux"',
      origin: 'https://www.bing.com'
    }
  })

  console.log(response.status)
  console.log(response.data)

  // for (const rawPosition of rawPositionsList) {
  //   const trafficPositionData = await requestTrafficDrive({ origin: basePointer, destiny: rawPosition })

  //   console.log({
  //     requestsCount: REQUESTS_COUNT,
  //     errorsCount: ERRORS_COUNT,
  //     requested: rawPosition,
  //     actualKm,
  //     pointersFoundeds: pointers.length
  //   })

  //   if (trafficPositionData == null) {
  //     continue
  //   }

  //   const kmDistance = trafficPositionData.resourceSets[0].resources[0].travelDistance
  //   const intKmDistance = Number.parseInt(kmDistance.toString(), 10)

  //   if (intKmDistance === actualKm) {
  //     continue
  //   }

  //   const newPointerFounded = {
  //     km: intKmDistance,
  //     position: rawPosition as [number, number]
  //   }

  //   pointers.push(newPointerFounded)
  //   actualKm = intKmDistance
  //   console.log({
  //     newPointerFounded
  //   })
  // }

  res.send(pointers)
}
