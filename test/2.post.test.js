const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

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
    .send({ name: "Name3", lastName: "LastName3", profile: "not a admin or guess" })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
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

  it('it should POST a second teacher with "phd=true"', () => {
    return request(app)
    .post('/api/v1/teacher')
    .send({ name: "Name2", lastName: "LastName2", phd:true })
    .then(function(res) { 
      assert.equal(res.status, 201);
    });
  });

  it('it should NOT POST a teacher without "phd=true"', () => {
    return request(app)
    .post('/api/v1/teacher')
    .send({ name: "Name3", lastName: "LastName3", phd:false })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
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
  });

  it('it should NOT POST a user without a valid course even if he have "age >= 17"', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name3", lastName: "LastName3", age: 18, course:[2] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  });

  it('it should NOT POST a user without "age >= 17" and a valid course', () => {
    return request(app)
    .post('/api/v1/user')
    .send({ name: "Name4", lastName: "LastName4", age: 16, course:[2] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});