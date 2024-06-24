import {
  Transaction,
  Station,
  MetroStationFares,
  BusFares,
  stations,
  busFares,
  metroStationFares
} from './config'

interface TransportService {
  getTransactionCharge(
    transaction?: Transaction,
    lastTransaction?: Transaction
  ): number
}

export class BusService implements TransportService {
  private fares: BusFares

  constructor(fares?: Partial<BusFares>) {
    this.fares = { ...busFares, ...fares }
  }

  public getTransactionCharge() {
    return this.fares.normalFare
  }
}

export class MetroService implements TransportService {
  private fares: MetroStationFares

  constructor(fares?: Partial<MetroStationFares>) {
    this.fares = { ...metroStationFares, ...fares }
  }

  public getTransactionCharge(
    transaction: Transaction,
    lastTransaction?: Transaction
  ) {
    const isEntry = transaction.gateType === 'entry'
    if (isEntry || !lastTransaction) return this.fares.maxFare

    return this.getChargebackForTransactions(transaction, lastTransaction)
  }

  private getChargebackForTransactions(
    transaction: Transaction,
    lastTransaction: Transaction
  ) {
    const transactionAZones = this.getStationZones(transaction.station)
    const transactionBZones = this.getStationZones(lastTransaction.station)

    const possibleChargebacks = transactionAZones.flatMap((zoneA) =>
      transactionBZones.map((zoneB) =>
        this.getChargebackForTwoZones(zoneA, zoneB)
      )
    )

    return Math.min(...possibleChargebacks)
  }

  private getChargebackForTwoZones(zoneA: number, zoneB: number) {
    const visitedZonesDistance = Math.abs(zoneA - zoneB) + 1
    const isOutsideFirstZone = zoneA !== 1 && zoneB !== 1

    if (visitedZonesDistance === 1 && isOutsideFirstZone) {
      return this.getChargebackForTicket(this.fares.anyOneZoneOutsideZone1Fare)
    }

    if (visitedZonesDistance === 1) {
      return this.getChargebackForTicket(this.fares.anywhereInZone1Fare)
    }

    if (visitedZonesDistance === 2 && isOutsideFirstZone) {
      return this.getChargebackForTicket(
        this.fares.anyTwoZonesExcludingZone1Fare
      )
    }

    if (visitedZonesDistance === 2) {
      return this.getChargebackForTicket(
        this.fares.anyTwoZonesIncludingZone1Fare
      )
    }

    return this.getChargebackForTicket(this.fares.moreThanTwoZonesFare)
  }

  private getStationZones(station: Station) {
    return stations[station]
  }

  private getChargebackForTicket(ticketPrice: number) {
    return -(this.fares.maxFare - ticketPrice)
  }
}
