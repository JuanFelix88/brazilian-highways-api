import Leaflet from 'leaflet'

let customIconGeneratedByKm: Leaflet.DivIcon
// let lastKm: number
export function getCustomIconMarkerByKm (km: number, selected?: boolean) {
  // if (km === lastKm) {
  //   return customIconGeneratedByKm
  // }

  customIconGeneratedByKm = Leaflet.divIcon({
    className: `custom-icon${selected === true ? ' selected-icon' : ''}`,
    html: `<span style="width: 100%; text-align: center">${
      km === 0 ? '0' : km.toString().padStart(2, '0')
    }</span>`,
    iconSize: [32, 28],
    popupAnchor: [1, -28],
    iconAnchor: [14, 28]
  })
  // lastKm = km

  return customIconGeneratedByKm
}
