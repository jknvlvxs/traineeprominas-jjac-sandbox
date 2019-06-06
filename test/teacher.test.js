const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('GET /api/v1/teacher', function() {
  it('should return OK status', ()=> {
    return request(app)
      .get('/api/v1/teacher')
      .then(function(res) {
          assert.equal(res.status, 200)
      });
  });

  it('should return an array', ()=> {
    return request(app)
      .get('/api/v1/teacher')
      .then(function(res) {
        assert.isArray(res.body);
      });
  });
});

describe('POST /api/v1/teacher', function() {
  it('it should POST a teacher with "phd=true"', () => {
    return request(app)
    .post('/api/v1/teacher')
    .send({ name: "Name1", lastName: "LastName1", phd:true })
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should NOT POST a teacher without "phd=true"', () => {
    return request(app)
    .post('/api/v1/teacher')
    .send({ name: "Name2", lastName: "LastName2", phd:false })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});