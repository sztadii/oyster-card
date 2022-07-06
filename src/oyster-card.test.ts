import { OysterCard } from './oyster-card'
import { BusService, MetroService } from './services'

describe('OysterCard', () => {
  it('works for the following / requested trip', () => {
    const oysterCard = new OysterCard(30, new BusService(), new MetroService())

    // 2.5 pounds fare
    oysterCard.touchTheReader({
      type: 'metro',
      station: 'Holborn',
      gateType: 'entry'
    })
    oysterCard.touchTheReader({
      type: 'metro',
      station: 'Earl’s Court',
      gateType: 'exit'
    })

    // 1.8 pounds fare
    oysterCard.touchTheReader({
      type: 'bus',
      station: 'Earl’s Court'
    })

    // 2 pounds fare
    oysterCard.touchTheReader({
      type: 'metro',
      station: 'Earl’s Court',
      gateType: 'entry'
    })
    oysterCard.touchTheReader({
      type: 'metro',
      station: 'Hammersmith',
      gateType: 'exit'
    })

    expect(oysterCard.getBalance()).toBe(30 - 2.5 - 1.8 - 2)
  })
})
