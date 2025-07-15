/**
 * Represents a single bank account in the Mable system.
 * Handles balance updates, withdrawals and deposits.
 */
class Account {
  constructor(accountNumber, balance) {
    this.accountNumber = accountNumber;
    this.balance = parseFloat(balance);
  }


  // Check if the account has enough funds to withdraw the specified amount.   
  canWithdraw(amount) {
    return this.balance >= amount;
  }


  // Deduct the amount from the account if funds are sufficient.
  withdraw(amount) {
    if (!this.canWithdraw(amount)) {
      throw new Error('Insufficient balance for withdrawal.');
    }
    this.balance = this.balance - amount;
  }


  // Add the specified amount to the account balance.   
  deposit(amount) {
    this.balance = this.balance + amount;
  }
}

module.exports = Account;
