import { OysterCard } from './oyster-card'

describe('OysterCard', () => {
  it('set the value', () => {
    const oysterCard = new OysterCard('new value')
    expect(oysterCard.value).toBe('new value')
  })
})
