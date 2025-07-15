/**
 * Represents a money transfer request between two accounts.
 */
class Transfer {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = parseFloat(amount);
  }
}

module.exports = Transfer;
