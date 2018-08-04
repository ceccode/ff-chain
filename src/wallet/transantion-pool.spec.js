
const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
  let tp;
  let wallet;
  let transaction;
  let bc;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    // // transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
    // tp.updateOrAddTransaction(transaction);
    transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
  });

  test('adds a transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  test('clear the transactions', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  test('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;
    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i += 1) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
        if ((i % 2) === 0) {
          transaction.input.amount = 9999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    test('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    test('grabs valid transactions', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});
