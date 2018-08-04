const blocks = require('./blocks');

describe('blocks', () => {
  test('should call res.json with []', () => {
    const json = jest.fn();
    const res = {
      json,
    };
    const req = {
      blockchain: {
        chain: [],
      },
    };
    blocks(req, res);

    expect(json.mock.calls).toHaveLength(1);
    expect(json.mock.calls[0][0]).toEqual([]);
  });
});
