const handleListen = require('./handleListen');

describe('handleListen', () => {
  test('should call log with Blockchain app...', () => {
    const PORT = 3000;
    const log = jest.fn();
    handleListen(log, PORT);

    expect(log.mock.calls).toHaveLength(1);
    expect(log.mock.calls[0][0]).toBe(`Blockchain app listening on port ${PORT.toString()}!`);
  });
});
