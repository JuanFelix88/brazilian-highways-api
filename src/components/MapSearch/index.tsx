import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import React, { useEffect, useRef, HTMLAttributes } from 'react'
import { getCustomIconMarkerByKm } from '../../utils/getCustomIconMarkerByKm'

interface MarkerPoint {
  position: [number, number]
  name: string
  km: number
  cityUf: string
  rod: string
  link: string
  id: string
}

type MapSearchProps = {
  position: [number, number]
  markers: MarkerPoint[]
  selected: MarkerPoint | null
  onMarkerClick?: (markerPoint: MarkerPoint) => void
} & HTMLAttributes<HTMLIFrameElement>

export default function Root({
  markers,
  position,
  selected,
  onMarkerClick,
  ...props
}: MapSearchProps) {
  const selectedMarkerRef = useRef<any>()

  useEffect(() => {
    if (selected != null) {
      queueMicrotask(() => selectedMarkerRef.current?.openPopup?.())
    }
  }, [selected])

  return (
    <MapContainer
      center={position}
      {...props}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}"
        maxZoom={20}
        className="tile-map"
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
      />
      {markers.map(markerPoint => (
        <Marker
          title={markerPoint.id}
          key={`${markerPoint.position.join('.')}${markerPoint.name}`}
          position={markerPoint.position}
          ref={markerPoint.id === selected?.id ? selectedMarkerRef : undefined}
          icon={getCustomIconMarkerByKm(
            markerPoint.km,
            markerPoint.id === selected?.id
          )}
          eventHandlers={{
            click: () => onMarkerClick?.(markerPoint)
          }}
        >
          <Popup>
            <h1 className="py-1 text-lg font-normal text-red-700">
              {markerPoint.name}
            </h1>
            <h3 className="text-sm font-normal italic">{markerPoint.rod}</h3>
            <h3 className="text-sm font-light">{markerPoint.cityUf}</h3>
            <br />
            <strong>Coordenadas</strong>:{' '}
            <i className="text-indigo-700">{markerPoint.position.join(', ')}</i>{' '}
            <br />
            <strong>Google Maps</strong>:{' '}
            <a
              className="text-red-700"
              href={`https://www.google.com.br/maps/place/${markerPoint.position.join(
                ','
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Link do Google
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
