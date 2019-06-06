const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('GET /api/v1/student', function() {
  it('should return OK status', ()=> {
    return request(app)
      .get('/api/v1/student')
      .then(function(res) {
          assert.equal(res.status, 200)
      });
  });

  it('should return an array', ()=> {
    return request(app)
      .get('/api/v1/student')
      .then(function(res) {
        assert.isArray(res.body);
      });
  });
});

describe('POST /api/v1/student', function() {
  it('it should POST a student with "age >= 17" and valid course', () => {
    return request(app)
    .post('/api/v1/student')
    .send({ name: "Name1", lastName: "LastName1", age: 18, course:[1] })
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should NOT POST a user without "age >= 17" even if he is on a valid course', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name2", lastName: "LastName2", age: 16, course:[1] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })

  it('it should NOT POST a user without a valid course even if he have "age >= 17"', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name3", lastName: "LastName3", age: 18, course:[2] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })

  it('it should NOT POST a user without "age >= 17" and a valid course', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name4", lastName: "LastName4", age: 16, course:[2] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});