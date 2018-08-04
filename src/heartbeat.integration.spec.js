const request = require('supertest');
const app = require('./app');

describe('', () => {
  test('should pass integration tests', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Up!')
      .end((err) => {
        if (err) throw done(err);
        done();
      });
  });
});
