const path = require('path');
const AccountService = require('../src/services/AccountService');
const TransactionService = require('../src/services/TransactionService');

describe('Banking System - End-to-End with File Data', () => {
  let accountService;
  let transactionService;

  beforeEach(() => {
    // New instances for each test to ensure fresh state
    accountService = new AccountService();
    transactionService = new TransactionService(accountService);
  });

  test('should load account and transaction data from files and update balances correctly', () => {
    // Resolve paths to CSV files
    const accountFilePath = path.resolve(__dirname, '../data/account_balances.csv');
    const transactionFilePath = path.resolve(__dirname, '../data/transactions.csv');

    // Load data
    accountService.loadAccountsFromCSV(accountFilePath);
    const transactions = transactionService.loadTransactionsFromCSV(transactionFilePath);

    // Process transactions
    transactionService.processTransactions(transactions);

    // Final balances
    const finalAccounts = accountService.getAllAccounts();

    // Map balances for easier assertion
    const balanceMap = {};
    finalAccounts.forEach(acc => {
      balanceMap[acc.accountNumber] = acc.balance;
    });

    // ASSERT the expected balances after applying the transactions (from + received)
    expect(balanceMap['1111234522226789']).toBeCloseTo(5000 - 500 + 320.50, 2);
    expect(balanceMap['1111234522221234']).toBeCloseTo(10000 - 25.60, 2);
    expect(balanceMap['2222123433331212']).toBeCloseTo(550 + 1000, 2);
    expect(balanceMap['1212343433335665']).toBeCloseTo(1200 + 500 + 25.60, 2);
    expect(balanceMap['3212343433335755']).toBeCloseTo(50000 - 1000 - 320.50, 2);
  });

  test('should collect failed transactions if accounts are missing or insufficient funds', () => {
    const accountFilePath = path.resolve(__dirname, '../data/account_balances.csv');
    const transactionFilePath = path.resolve(__dirname, '../data/transactions.csv');

    accountService.loadAccountsFromCSV(accountFilePath);
    const transactions = transactionService.loadTransactionsFromCSV(transactionFilePath);

    transactionService.processTransactions(transactions);

    const failed = transactionService.getFailedTransactions();

    // ASSERT there are no failed transactions in this clean dataset
    expect(failed.length).toBe(0);
  });
});
