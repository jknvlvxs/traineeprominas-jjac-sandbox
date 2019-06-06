const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('GET /api/v1/course', function() {
  it('should return OK status', ()=> {
    return request(app)
      .get('/api/v1/course')
      .then(function(res) {
          assert.equal(res.status, 200)
      });
  });

  it('should return an array', ()=> {
    return request(app)
      .get('/api/v1/course')
      .then(function(res) {
        assert.isArray(res.body);
      });
  });
});

describe('POST /api/v1/course', function() {
  it('it should POST a course with more than 2 teachers', () => {
    return request(app)
    .post('/api/v1/course')
    .send({ name:"Name1", period:"Period1", city:"City1", teacher:[1, 2]})
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should NOT POST a course without more than 2 teachers', () => {
    return request(app)
    .post('/api/v1/course')
    .send({ name:"Name2", period:"Period2", city:"City2", teacher:[1]})
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});