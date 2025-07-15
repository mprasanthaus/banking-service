const AccountService = require('./services/AccountService');
const TransactionService = require('./services/TransactionService');

const accountService = new AccountService();
const transactionService = new TransactionService(accountService);

// load data
accountService.loadAccountsFromCSV('./data/account_balances.csv');
const transactions = transactionService.loadTransactionsFromCSV('./data/transactions.csv');

// process transactions
transactionService.processTransactions(transactions);

// show results
console.log('\nFinal Account Balances:\n');
accountService.getAllAccounts().forEach(account => {
  console.log(`${account.accountNumber}: $${account.balance.toFixed(2)}`);
});