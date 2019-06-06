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