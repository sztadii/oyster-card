# oyster-card

## The problem to solve

You are required to model the following fare card system which is a limited version of London’s Oyster card system. <br/>
At the end of the test, you should be able to demonstrate a user loading a card with £30, <br/>
and taking the following trips, and then viewing the balance. <br />

- Tube Holborn to Earl’s Court
- 328 bus from Earl’s Court to Chelsea
- Tube from Earl’s court to Hammersmith

### Operation

- When the user passes through the inward barrier at the station, their oyster card is charged the maximum fare.
- When they pass out of the barrier at the exit station, the fare is calculated and the maximum fare transaction removed and replaced with the real transaction (in this way, if the user doesn’t swipe out, they are charged the maximum fare).
- All bus journeys are charged at the same price.
- The system should favour the customer where more than one fare is possible for a given
  journey. E.g. Holburn to Earl’s Court is charged at £2.50.

### Assume station zones are as follows:

| Station      | Zone(s) |
| ------------ | ------- |
| Holborn      | 1       |
| Aldgate      | 1       |
| Earl’s Court | 1, 2    |
| Hammersmith  | 2       |
| Arsenal      | 2       |
| Wimbledon    | 3       |

### Assume fares are as follows:

| Journey                        | Fare  | Example                     |
| ------------------------------ | ----- | --------------------------- |
| Anywhere in Zone 1             | £2.50 | From Holborn to Aldgate     |
| Any one zone outside zone 1    | £2.00 | From Arsenal to Hammersmith |
| Any two zones including zone 1 | £3.00 | From Hammersmith to Holborn |
| Any two zones excluding zone 1 | £2.25 | From Arsenal to Wimbledon   |
| More than two zones (3+)       | £3.20 | From Wimbledon to Aldgate   |
| Any bus journey                | £1.80 | Earl’s Court to Chelsea     |

## How to run the app

Please install `node manager` from `https://github.com/tj/n` <br>
Set up the node version ( specified in engines.node inside the package.json ) by running

```
n auto
```

After that you can install dependencies by running

```
npm install
```

Once you will download the dependencies then you can run the app by

```
npm test
```
