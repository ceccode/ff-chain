const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return undefined;
    }

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipient });
    this.input = Transaction.signTransaction(this, senderWallet).input;
    // Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    transaction.input = Transaction.signTransaction(transaction, senderWallet).input;
    // Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return undefined;
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [{
      amount: MINING_REWARD, address: minerWallet.publicKey,
    }]);
  }

  static signTransaction(transaction, senderWallet) {
    const signedTransaction = { ...transaction };
    signedTransaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
    return signedTransaction;
  }

  // static signTransaction(transaction, senderWallet) {
  //   transaction.input = {
  //     timestamp: Date.now(),
  //     amount: senderWallet.balance,
  //     address: senderWallet.publicKey,
  //     signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
  //   };
  // }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs),
    );
  }
}

module.exports = Transaction;
