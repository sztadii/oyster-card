export const stations = {
  Holborn: [1],
  Aldgate: [1],
  Hammersmith: [2],
  Arsenal: [2],
  Wimbledon: [3],
  ['Earl’s Court']: [1, 2]
}

export const busFares = {
  normalFare: 1.8
}

export const metroStationFares = {
  anywhereInZone1Fare: 2.5,
  anyOneZoneOutsideZone1Fare: 2,
  anyTwoZonesIncludingZone1Fare: 3,
  anyTwoZonesExcludingZone1Fare: 2.25,
  moreThanTwoZonesFare: 3.2,
  maxFare: 3.2
}

export type Station = keyof typeof stations
export type MetroStationFares = typeof metroStationFares
export type BusFares = typeof busFares

export interface Transaction {
  type: 'bus' | 'metro'
  station: Station
  gateType?: 'entry' | 'exit'
}
