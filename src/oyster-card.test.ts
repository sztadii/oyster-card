import { OysterCard } from './oyster-card'
import { BusService, MetroService } from './services'

describe('OysterCard', () => {
  it('works for the following / requested trip', () => {
    const oysterCard = new OysterCard(new BusService(), new MetroService())

    oysterCard.increaseBalance(30)

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

  it('throw an error if there are no founds on the card', () => {
    const oysterCard = new OysterCard(
      new BusService({ normalFare: 2 }),
      new MetroService()
    )

    oysterCard.increaseBalance(1.99)

    expect(() => {
      oysterCard.touchTheReader({
        type: 'bus',
        station: 'Hammersmith'
      })
    }).toThrow('No funds on the card :(')
  })

  it('works for a bus trip', () => {
    const initialBalance = 10
    const normalFare = 3

    const oysterCard = new OysterCard(
      new BusService({ normalFare }),
      new MetroService()
    )

    oysterCard.increaseBalance(10)

    oysterCard.touchTheReader({
      type: 'bus',
      station: 'Hammersmith'
    })

    expect(oysterCard.getBalance()).toBe(initialBalance - normalFare)
  })

  describe('works for a metro trip', () => {
    it('anywhere in zone 1', () => {
      const initialBalance = 20
      const anywhereInZone1Fare = 10

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          anywhereInZone1Fare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Holborn',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Aldgate',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(initialBalance - anywhereInZone1Fare)
    })

    it('any one zone outside zone 1', () => {
      const initialBalance = 30
      const anyOneZoneOutsideZone1Fare = 10

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          anyOneZoneOutsideZone1Fare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Hammersmith',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(
        initialBalance - anyOneZoneOutsideZone1Fare
      )
    })

    it('any two zones including zone 1', () => {
      const initialBalance = 4
      const anyTwoZonesIncludingZone1Fare = 1

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          anyTwoZonesIncludingZone1Fare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Hammersmith',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Holborn',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(
        initialBalance - anyTwoZonesIncludingZone1Fare
      )
    })

    it('any two zones excluding zone 1', () => {
      const initialBalance = 30
      const anyTwoZonesExcludingZone1Fare = 4

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          anyTwoZonesExcludingZone1Fare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Wimbledon',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(
        initialBalance - anyTwoZonesExcludingZone1Fare
      )
    })

    it('more than two zones (3+)', () => {
      const initialBalance = 50
      const moreThanTwoZonesFare = 10

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          moreThanTwoZonesFare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Wimbledon',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Aldgate',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(
        initialBalance - moreThanTwoZonesFare
      )
    })

    it('from Earl’s Court to Arsenal and back', () => {
      const oysterCard = new OysterCard(new BusService(), new MetroService())

      oysterCard.increaseBalance(30)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Earl’s Court',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'exit'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'entry'
      })

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Earl’s Court',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(26)
    })

    it('charge the maxFare when the user touches the reader only during entry', () => {
      const initialBalance = 100
      const maxFare = 40

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          maxFare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'entry'
      })

      expect(oysterCard.getBalance()).toBe(initialBalance - maxFare)
    })

    it('charge the maxFare when the user touches the reader only during exit', () => {
      const initialBalance = 10
      const maxFare = 6

      const oysterCard = new OysterCard(
        new BusService(),
        new MetroService({
          maxFare
        })
      )

      oysterCard.increaseBalance(initialBalance)

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'exit'
      })

      expect(oysterCard.getBalance()).toBe(initialBalance - maxFare)
    })
  })
})
