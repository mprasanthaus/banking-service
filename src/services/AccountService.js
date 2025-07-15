const fs = require('fs');
const path = require('path');
const Account = require('../models/Account');

/*
 * AccountService manages all bank accounts in the system.
 */
class AccountService {
  constructor() {
    // Using a Map to store accounts with account numbers as keys for fast lookup
    this.accounts = new Map();
  }

  /* Loads account data from a CSV file into the accounts Map. */
  loadAccountsFromCSV(csvFilePath) {
    try {
      // Resolve the full path to avoid relative path issues
      const filePath = path.resolve(csvFilePath);
      const data = fs.readFileSync(filePath, 'utf-8');
      const lines = data.trim().split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [accountNumber, balance] = line.split(',').map(item => item.trim());

        // Ensure the line has exactly two parts
        if (!accountNumber || !balance) {
          console.warn(`Skipping line ${i}: "${line}" - expected format: accountNumber,balance`);
          continue;
        }

        // Validate account number (16 digits) and balance (numeric)
        if (!/^\d{16}$/.test(accountNumber)) {
          console.warn(`Skipping line ${i}: "${line}" - invalid account number (must be 16 digits)`);
          continue;
        }
        const balanceValue = parseFloat(balance);
        if (isNaN(balanceValue)) {
          console.warn(`Skipping line ${i}: "${line}" - invalid balance (must be a number)`);
          continue;
        }

        // Create a new Account and store it
        const account = new Account(accountNumber, balanceValue);
        this.accounts.set(accountNumber, account);
      }
    } catch (error) {
      console.error(`Failed to load accounts from ${csvFilePath}: ${error.message}`);
      throw new Error('Could not load account data from CSV file');
    }
  }

  /* Retrieves a single account by its account number.   */
  getAccount(accountNumber) {
    const account = this.accounts.get(accountNumber);
    if (!account) {
      console.log(`No account found for number: ${accountNumber}`);
    }
    return account || null;
  }

  /* Gets all accounts currently loaded in the system.  */
  getAllAccounts() {
    return Array.from(this.accounts.values());
  }
}

module.exports = AccountService;