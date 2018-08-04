const hello = require('./heartbeat');

describe('heartbeat', () => {
  test('should call res.send with Up!', () => {
    const send = jest.fn();
    const res = {
      send,
    };
    hello({}, res);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe('Up!');
  });
});
