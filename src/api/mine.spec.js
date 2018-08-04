const mine = require('./mine');

describe('mine', () => {
  test('should call send once', () => {
    const next = jest.fn();

    const res = {};
    const req = {
      body: {
        data: 'Foo',
      },
      blockchain: {
        addBlock: () => 'Foo',
      },
    };
    mine(req, res, next);

    expect(next.mock.calls).toHaveLength(1);
    // expect(next.mock.calls[0][0]).toEqual('New block added.');
  });
});
