const Transaction = require('./../wallet/transaction');
const Wallet = require('./../wallet');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();

    // include a reward transaction for the miner
    console.log('include a reward transaction for the miner');
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

    // create a block consisting of the valid transactions
    console.log('create a block consisting of the valid transactions');
    const block = this.blockchain.addBlock(validTransactions);

    // synchronize chains in the peer-to-peer server
    console.log('synchronize chains in the peer-to-peer server');
    this.p2pServer.syncChains();

    // clear the transaction pool
    console.log('clear the transaction pool');
    this.transactionPool.clear();

    // broadcast to every miner to clear their transaction pools
    console.log('broadcast to every miner to clear their transaction pools');
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;
