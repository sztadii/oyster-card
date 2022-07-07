import { OysterCard } from './oyster-card'
import { BusService, MetroService } from './services'
import { metroStationFares } from './types'

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

    expect(oysterCard.balance).toBe(30 - 2.5 - 1.8 - 2)
  })

  it('throw an error if there are no founds on the card', () => {
    const oysterCard = new OysterCard(0, new BusService(), new MetroService())

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
      initialBalance,
      new BusService({ normalFare }),
      new MetroService()
    )

    oysterCard.touchTheReader({
      type: 'bus',
      station: 'Hammersmith'
    })

    expect(oysterCard.balance).toBe(initialBalance - normalFare)
  })

  describe('works for a metro trip', () => {
    it('anywhere in zone 1', () => {
      const initialBalance = 20
      const anywhereInZone1Fare = 10

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anywhereInZone1Fare
        })
      )

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

      expect(oysterCard.balance).toBe(initialBalance - anywhereInZone1Fare)
    })

    it('any one zone outside zone 1', () => {
      const initialBalance = 30
      const anyOneZoneOutsideZone1Fare = 10

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anyOneZoneOutsideZone1Fare
        })
      )

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

      expect(oysterCard.balance).toBe(
        initialBalance - anyOneZoneOutsideZone1Fare
      )
    })

    it('any two zones including zone 1', () => {
      const initialBalance = 4
      const anyTwoZonesIncludingZone1Fare = 1

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anyTwoZonesIncludingZone1Fare
        })
      )

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

      expect(oysterCard.balance).toBe(
        initialBalance - anyTwoZonesIncludingZone1Fare
      )
    })

    it('any two zones excluding zone 1', () => {
      const initialBalance = 30
      const anyTwoZonesExcludingZone1Fare = 4

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anyTwoZonesExcludingZone1Fare
        })
      )

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

      expect(oysterCard.balance).toBe(
        initialBalance - anyTwoZonesExcludingZone1Fare
      )
    })

    it('more than two zones (3+)', () => {
      const initialBalance = 50
      const moreThanTwoZonesFare = 10

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          moreThanTwoZonesFare
        })
      )

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

      expect(oysterCard.balance).toBe(initialBalance - moreThanTwoZonesFare)
    })

    it('from Earl’s Court to Arsenal and back', () => {
      const oysterCard = new OysterCard(
        30,
        new BusService(),
        new MetroService()
      )

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

      expect(oysterCard.balance).toBe(26)
    })

    it('charge the maxFare when the user touches the reader only during entry', () => {
      const initialBalance = 100
      const maxFare = 40

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          maxFare
        })
      )

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'entry'
      })

      expect(oysterCard.balance).toBe(initialBalance - maxFare)
    })

    it('charge the maxFare when the user touches the reader only during exit', () => {
      const initialBalance = 10
      const maxFare = 6

      const oysterCard = new OysterCard(
        initialBalance,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          maxFare
        })
      )

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'exit'
      })

      expect(oysterCard.balance).toBe(initialBalance - maxFare)
    })
  })
})
