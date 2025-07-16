# Banking Service

This is a  Node.js backend that simulates a basic banking system. It takes a CSV of starting account balances and a second CSV of transactions for the day, and processes the transfers — as long as they don't overdraw the account.

It's built with a focus on clean code, simple domain models, and test coverage.

---

## How it works

- Each account has a 16-digit number and a balance.
- We load those from `account_balances.csv`.
- Then we process a set of transfers from `transactions.csv`.
- Transfers only go through if the source account has enough funds.

Once done, the final account balances are printed to the console.

---

## Setup

Clone the repo and install dependencies:

```bash
npm install
```

To run the processor:

```bash
node src/index.js
```

Make sure the `data/` folder has the correct CSVs:
- `account_balances.csv`
- `transactions.csv`

---

## Running tests

Tests are written using [Jest](https://jestjs.io/). You can run them with:

```bash
npm test
```

Right now they check for valid and invalid transactions, and some edge cases.

---

## CSV Formats

### Account balances (`account_balances.csv`) with NO header

```
Account,Balance
1111234522226789,5000.00
2222123433331212,550.00
```

### Transactions (`transactions.csv`) with NO header
```
From,To,Amount
1111234522226789,2222123433331212,100.00
```

---

## Known limitations

- No rollback or partial updates if there's an error halfway through.
- Assumes all accounts in the transactions file exist in the balances file.

---

## Future improvements

- Handle malformed or missing data in CSVs
- Save updated balances to a new CSV file
- More test coverage for edge cases

---

## Why this exists

This was built for a backend code test for Banking Transactions, to show how I approach structure, modeling, and data integrity in small systems. Feedback welcome.
