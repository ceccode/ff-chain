const getBlockchainMiddleware = require('./getBlockchainMiddleware');
const Blockchain = require('./../blockchain');

describe('getBlockchainMiddleware', () => {
  let gbm;

  beforeEach(() => {
    gbm = getBlockchainMiddleware();
  });

  test('should return a function()', () => {
    expect(gbm).toEqual(expect.any(Function));
  });

  test('should accept three arguments', () => {
    expect(gbm).toHaveLength(3);
  });

  test('Should call send once on invalid blockchain', () => {
    const send = jest.fn();
    const res = {
      send,
    };
    gbm({}, res);
    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe(500);
  });

  test('Should call next once on valid blockchain', () => {
    const next = jest.fn();
    gbm = getBlockchainMiddleware(new Blockchain());
    gbm({}, {}, next);
    expect(next.mock.calls).toHaveLength(1);
  });
});
