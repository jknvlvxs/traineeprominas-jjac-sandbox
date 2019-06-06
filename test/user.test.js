const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('GET /api/v1/user', function() {
  it('should return OK status', ()=> {
    return request(app)
      .get('/api/v1/user')
      .then(function(res) {
          assert.equal(res.status, 200)
      });
  });

  it('should return an array', ()=> {
    return request(app)
      .get('/api/v1/user')
      .then(function(res) {
        assert.isArray(res.body);
      });
  });
});

describe('POST /api/v1/user', function() {
  it('it should POST a user with "admin" on profile', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name1", lastName: "LastName1", profile: "admin" })
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should POST a user with "guess" on profile', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name2", lastName: "LastName2", profile: "guess" })
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should NOT POST a user without "guess" or "admin" on profile', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name3", lastName: "LastName3", profile: "asdsadas" })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});