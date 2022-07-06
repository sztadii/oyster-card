import {
  Transaction,
  Station,
  stations,
  busFares,
  metroStationFares
} from './types'

export class BusService {
  constructor(private fares = busFares) {}

  public getTransactionCharge() {
    return this.fares.normal
  }
}

export class MetroService {
  constructor(private fares = metroStationFares) {}

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
      return this.getChargebackForTicket(this.fares.anyOneZoneOutsideZone1)
    }

    if (visitedZonesDistance === 1) {
      return this.getChargebackForTicket(this.fares.anywhereInZone1)
    }

    if (visitedZonesDistance === 2 && isOutsideFirstZone) {
      return this.getChargebackForTicket(this.fares.anyTwoZonesExcludingZone1)
    }

    if (visitedZonesDistance === 2) {
      return this.getChargebackForTicket(this.fares.anyTwoZonesIncludingZone1)
    }

    return this.getChargebackForTicket(this.fares.moreThanTwoZones)
  }

  private getStationZones(station: Station) {
    return stations[station]
  }

  private getChargebackForTicket(ticketPrice: number) {
    return -(this.fares.maxFare - ticketPrice)
  }
}
