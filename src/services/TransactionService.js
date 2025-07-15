const fs = require('fs');
const path = require('path');
const Transaction = require('../models/Transaction');

/*
 * TransactionService handles processing of transactions in the banking system.
 */
class TransactionService {

  // Sets up the service with a reference to AccountService.
  constructor(accountService) {
    if (!accountService) {
      throw new Error('AccountService required.');
    }
    this.accountService = accountService;
    this.failedTransactions = [];
  }


  /* Loads transactions from a CSV file. */
  loadTransactionsFromCSV(filePath) {
    const transactions = [];
    try {
      // Resolve the full path to avoid issues with relative paths
      const fullPath = path.resolve(filePath);
      const data = fs.readFileSync(fullPath, 'utf-8');
      const lines = data.trim().split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [fromAccount, toAccount, amount] = line.split(',').map(item => item.trim());

        // Check for correct CSV format
        if (!fromAccount || !toAccount || !amount) {
          console.warn(`Line ${i}: Skipping invalid transaction "${line}" - expected format: fromAccount,toAccount,amount`);
          continue;
        }

        // Validate account numbers (assuming 16 digits) and amount
        if (!/^\d{16}$/.test(fromAccount) || !/^\d{16}$/.test(toAccount)) {
          console.warn(`Line ${i}: Skipping "${line}" - account numbers must be 16 digits`);
          continue;
        }
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
          console.warn(`Line ${i}: Skipping "${line}" - amount must be a positive number`);
          continue;
        }

        // Create and store the transaction
        transactions.push(new Transaction(fromAccount, toAccount, amountValue));
      }
      
    } catch (error) {
      console.error(`Error loading transactions from ${filePath}: ${error.message}`);
      throw new Error('Failed to read or parse transaction CSV file');
    }
    return transactions;
  }


  /* Processes a list of transactions, transferring funds between accounts. */
  processTransactions(transactions) {
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      const fromAccount = this.accountService.getAccount(tx.from);
      const toAccount = this.accountService.getAccount(tx.to);

      // Validate that both accounts exist
      if (!fromAccount || !toAccount) {
        this._logFailure(tx, `Account not found: ${!fromAccount ? tx.from : tx.to}`);

        console.log(`Transaction ${i + 1} failed: One or both accounts not found (${tx.from} -> ${tx.to})`);
        continue;
      }

      // Check if source account has sufficient funds
      if (!fromAccount.canWithdraw(tx.amount)) {
        this._logFailure(tx, 'Insufficient funds');
        console.log(`Transaction ${i + 1} failed: Insufficient funds in ${tx.from} for ${tx.amount}`);
        continue;
      }

      // Execute the transfer
      try {
        fromAccount.withdraw(tx.amount);
        toAccount.deposit(tx.amount);
        console.log(`Transaction ${i + 1} completed: ${tx.from} -> ${tx.to} for ${tx.amount}`);
      } catch (error) {
        this._logFailure(tx, `Transfer failed: ${error.message}`);
        console.error(`Transaction ${i + 1} failed: ${error.message}`);
      }
    }
  }

  /* Failure logging method */
  _logFailure(transaction, reason) {
    this.failedTransactions.push({
      transaction,
      reason,
      timestamp: new Date().toISOString()
    });
    console.log(`✗ Failed: ${reason}`);
  }

  /* Returns the list of failed transactions with their reasons. */
  getFailedTransactions() {
    return this.failedTransactions;
  }

  /* quick summary for debugging */
  getSummary() {
    return {
      totalFailed: this.failedTransactions.length,
      failures: this.failedTransactions.map(f => f.reason)
    };
  }
}

module.exports = TransactionService;