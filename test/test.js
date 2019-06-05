const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');


describe('--- TIMEOUT ---', function() {

  this.timeout(20000);

  before(done => {
    setTimeout(() => {
      done();
    }, 10000);
  });

  it('it should POST a user with ok profile', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "New Test User", lastName: "01", profile: "admin" })
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should NOT POST a user with error on profile', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "New Test User", lastName: "01", profile: "asdsadas" })
    .then(function(res) { 
      assert.equal(res.status, 401);
    });
})});