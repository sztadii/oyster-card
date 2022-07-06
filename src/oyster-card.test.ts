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

    expect(oysterCard.getBalance()).toBe(30 - 2.5 - 1.8 - 2)
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
    const oysterCard = new OysterCard(
      10,
      new BusService({ normal: 1.8 }),
      new MetroService()
    )

    oysterCard.touchTheReader({
      type: 'bus',
      station: 'Hammersmith'
    })

    const balance = oysterCard.getBalance()

    expect(balance).toBe(8.2)
  })

  describe('works for a metro trip', () => {
    it('anywhere in zone 1', () => {
      const oysterCard = new OysterCard(
        5,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anywhereInZone1: 2.5
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

      const balance = oysterCard.getBalance()

      expect(balance).toBe(2.5)
    })

    it('any one zone outside zone 1', () => {
      const oysterCard = new OysterCard(
        30,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anyOneZoneOutsideZone1: 2
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

      const balance = oysterCard.getBalance()

      expect(balance).toBe(28)
    })

    it('any two zones including zone 1', () => {
      const oysterCard = new OysterCard(
        30,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anyTwoZonesIncludingZone1: 3
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

      const balance = oysterCard.getBalance()

      expect(balance).toBe(27)
    })

    it('any two zones excluding zone 1', () => {
      const oysterCard = new OysterCard(
        30,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          anyTwoZonesExcludingZone1: 2.25
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

      const balance = oysterCard.getBalance()

      expect(balance).toBe(27.75)
    })

    it('more than two zones (3+)', () => {
      const oysterCard = new OysterCard(
        30,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          moreThanTwoZones: 3.2
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

      const balance = oysterCard.getBalance()

      expect(balance).toBe(26.8)
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

      const balance = oysterCard.getBalance()

      expect(balance).toBe(26)
    })

    it('charge the maxFare when the user touches the reader only during entry', () => {
      const oysterCard = new OysterCard(
        20,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          maxFare: 5
        })
      )

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'entry'
      })

      const balance = oysterCard.getBalance()

      expect(balance).toBe(15)
    })

    it('charge the maxFare when the user touches the reader only during exit', () => {
      const oysterCard = new OysterCard(
        50,
        new BusService(),
        new MetroService({
          ...metroStationFares,
          maxFare: 10
        })
      )

      oysterCard.touchTheReader({
        type: 'metro',
        station: 'Arsenal',
        gateType: 'exit'
      })

      const balance = oysterCard.getBalance()

      expect(balance).toBe(40)
    })
  })
})
