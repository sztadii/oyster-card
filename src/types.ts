export const stations = {
  Holborn: [1],
  Aldgate: [1],
  Hammersmith: [2],
  Arsenal: [2],
  Wimbledon: [3],
  ['Earl’s Court']: [1, 2]
}

export interface Transaction {
  type: 'bus' | 'metro'
  station: Station
  gateType?: 'entry' | 'exit'
}

export type Station = keyof typeof stations
