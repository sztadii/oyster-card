export const stations = {
  Holborn: [1],
  Aldgate: [1],
  Hammersmith: [2],
  Arsenal: [2],
  Wimbledon: [3],
  ['Earl’s Court']: [1, 2]
}

export const busFares = {
  normal: 1.8
}

export const metroStationFares = {
  anywhereInZone1: 2.5,
  anyOneZoneOutsideZone1: 2,
  anyTwoZonesIncludingZone1: 3,
  anyTwoZonesExcludingZone1: 2.25,
  moreThanTwoZones: 3.2,
  maxFare: 3.2
}

export type Station = keyof typeof stations

export interface Transaction {
  type: 'bus' | 'metro'
  station: Station
  gateType?: 'entry' | 'exit'
}
