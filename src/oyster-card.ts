import { Transaction } from './types'
import { BusService, MetroService } from './services'

export class OysterCard {
  private lastTransaction?: Transaction

  constructor(
    public balance: number,
    private busService: BusService,
    private metroService: MetroService
  ) {}

  public touchTheReader(transaction: Transaction) {
    const transportationService = {
      bus: this.busService,
      metro: this.metroService
    }[transaction.type]

    // Can be positive or negative
    const paymentAmount = transportationService.getTransactionCharge(
      transaction,
      this.lastTransaction
    )

    this.balance = this.calculateNewBalance(paymentAmount)
    this.lastTransaction = transaction
  }

  private calculateNewBalance(paymentAmount: number) {
    const newBalance = this.balance - paymentAmount
    if (newBalance < 0) throw new Error('No funds on the card :(')

    return newBalance
  }
}
