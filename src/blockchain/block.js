const ChainUtil = require('../chain-util');

const {
  DIFFICULTY,
  MINE_RATE,
} = require('../config');

const getHash = (timestamp, lastHash, data, nonce, difficulty) => ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block - 
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash     : ${this.hash.substring(0, 10)}
      Nonce    : ${this.nonce}
      Data     : ${this.data}
      Difficulty: ${this.difficulty}`;
  }

  static genesis() {
    return new this('Genesis time', '-----', 'd56d0fe1b985c1eaa75f142d33955aaa678f44cf44b3d6952b3b3d8632cb17da', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;

    let hash;
    let timestamp;
    let nonce = 0;

    let { difficulty } = lastBlock;

    do {
      nonce += 1;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = getHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static blockHash(block) {
    const {
      timestamp, lastHash, data, nonce, difficulty,
    } = block;
    return getHash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
