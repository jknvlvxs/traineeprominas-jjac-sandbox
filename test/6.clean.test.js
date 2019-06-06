const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('CLEAN COLLECTION USER', function() {
  it('it should DELETE ALL users', () => {
    return request(app)
    .delete('/api/v1/user')
    .then(function(res) { 
      assert.equal(res.status, 204);
    });
  });
});

describe('CLEAN COLLECTION TEACHER', function() {
  it('it should DELETE ALL teachers"', () => {
    return request(app)
    .delete('/api/v1/teacher')
    .then(function(res) { 
      assert.equal(res.status, 204);
    });
  });
});

describe('CLEAN COLLECTION COURSE', function() {
  it('it should DELETE ALL courses', () => {
    return request(app)
    .delete('/api/v1/course')
    .then(function(res) { 
      assert.equal(res.status, 204);
    });
  });
});

describe('CLEAN COLLECTION STUDENT', function() {
  it('it should DELETE ALL students', () => {
    return request(app)
    .delete('/api/v1/student')
    .then(function(res) { 
      assert.equal(res.status, 204);
    });
  });
});