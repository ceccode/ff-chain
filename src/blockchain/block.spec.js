const Block = require('./block');

describe('Block', () => {
  let data;
  let lastBlock;
  let block;

  beforeEach(() => {
    data = 'dummy data';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  test('sets the `lastHash` to match the previous one', () => {
    expect(block.lastHash).toBe(lastBlock.hash);
  });

  test('sets the `data` to match the input', () => {
    expect(block.data).toEqual(data);
  });

  test('generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });

  test('lowers the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
  });

  test('raises the difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });
});
