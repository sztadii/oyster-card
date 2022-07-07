import { Transaction } from './config'
import { BusService, MetroService } from './services'

export class OysterCard {
  private balance = 0
  private lastTransaction?: Transaction

  constructor(
    private busService: BusService,
    private metroService: MetroService
  ) {}

  public getBalance() {
    return this.balance
  }

  public increaseBalance(amount: number) {
    this.balance += amount
  }

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
