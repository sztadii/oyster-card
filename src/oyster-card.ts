import { BusService, MetroService } from './services'
import { Transaction } from './types'

export class OysterCard {
  constructor(
    private balance: number,
    private busService: BusService,
    private metroService: MetroService
  ) {}

  public touchTheReader(transaction: Transaction) {
  }

  public getBalance() {
    return this.balance
  }
}
