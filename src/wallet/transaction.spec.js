const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction', () => {
  let transaction;
  let wallet;
  let recipient;
  let amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'r3c1p13nt';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  describe('outputs', () => {
    test('the `amount` subtracted from the wallet balance', () => {
      expect(transaction.outputs
        .find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount);
    });

    test('the `amount` added to the recipient', () => {
      expect(transaction.outputs
        .find(output => output.address === recipient).amount)
        .toEqual(amount);
    });

    describe('transacting with an amount that exceeds the balance', () => {
      beforeEach(() => {
        amount = 50000;
        transaction = Transaction.newTransaction(wallet, recipient, amount);
      });

      test('does not create the transaction', () => {
        expect(transaction).toEqual(undefined);
      });
    });
  });

  describe('inputs', () => {
    test('the balance of the wallet', () => {
      expect(transaction.input.amount).toEqual(wallet.balance);
    });
  });

  describe('validation', () => {
    test('validates a valid transaction', () => {
      expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    test('invalidates a corrupt transaction', () => {
      transaction.outputs[0].amount = 50000;
      expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });
  });

  describe('and updating a transaction', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = 'n3xt-4ddr355';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    test("subtracts the next amount from the sender's output", () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });

    test('outputs an amount for the next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    });
  });

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });

    test("reward the miner's wallet", () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(MINING_REWARD);
    });
  });
});
