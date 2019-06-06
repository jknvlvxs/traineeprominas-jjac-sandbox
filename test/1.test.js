const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('Aguardando banco...', function() {
  this.timeout(12000);
  before(done => {
    setTimeout(() => {
      done();
    }, 10000);
  });

  it('Testing Connection...', function() {
    return request(app)
      .get('/api/v1')
      .then(function(res){
          assert.equal(res.status, 200)
      })
  });
});

// describe('DELETE /api/v1/user', function() {
//   it('it should DELETE user 1', () => {
//     return request(app)
//     .delete('/api/v1/user/1')
//     .then(function(res) { 
//       assert.equal(res.status, 200);
//     });
//   });

//   it('it should DELETE user 2', () => {
//     return request(app)
//     .delete('/api/v1/user/2')
//     .then(function(res) { 
//       assert.equal(res.status, 200);
//     });
//   });
// });

// describe('DELETE /api/v1/teacher', function() {
//   it('it should DELETE teacher 1"', () => {
//     return request(app)
//     .delete('/api/v1/teacher/1')
//     .then(function(res) { 
//       assert.equal(res.status, 200);
//     });
//   });

//   it('it should DELETE teacher 2', () => {
//     return request(app)
//     .delete('/api/v1/teacher/2')
//     .then(function(res) { 
//       assert.equal(res.status, 200);
//     });
//   });
// });

// describe('DELETE /api/v1/course', function() {
//   it('it should DELETE course 1', () => {
//     return request(app)
//     .delete('/api/v1/course/1')
//     .then(function(res) { 
//       assert.equal(res.status, 200);
//     });
//   });
// });

// describe('DELETE /api/v1/student', function() {
//   it('it should DELETE student 1', () => {
//     return request(app)
//     .delete('/api/v1/student/1')
//     .then(function(res) { 
//       assert.equal(res.status, 200);
//     });
//   });
// });