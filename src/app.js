const express = require('express');
const bodyParser = require('body-parser');

const Blockchain = require('./blockchain');
const heartbeat = require('./heartbeat');
const blocks = require('./api/blocks');
const mine = require('./api/mine');
const getBlockchainMiddleware = require('./api/getBlockchainMiddleware');
const Wallet = require('./wallet');
const TransactionPool = require('./wallet/transaction-pool');
const Miner = require('./miner');

const P2pServer = require('./p2p-server');

const app = express();

const blockchain = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain, tp);
const miner = new Miner(blockchain, tp, wallet, p2pServer);

const { celebrate, Joi, errors } = require('celebrate');

app.use(bodyParser.json());

app.get('/', heartbeat);

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, blockchain, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.get('/blocks', getBlockchainMiddleware(blockchain), blocks);

app.post('/mine', getBlockchainMiddleware(blockchain), celebrate({
  body: Joi.object().keys({
    data: Joi.any().required().empty(),
  }),
}), mine, (req, res) => {
  p2pServer.syncChains();
  res.send('New block added.');
});

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.redirect('/blocks');
});

app.use(errors());
app.p2pServer = p2pServer;

module.exports = app;
