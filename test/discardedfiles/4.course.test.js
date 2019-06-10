const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('POST /api/v1/course', function() {
  it('it should POST a course with more than 2 teachers', () => {
  return request(app)
  .post('/api/v1/course')
  .send({ name:"Name1", city:"City1", teacher:[1, 2]})
  .then(function(res) { 
    assert.equal(res.status, 201);
  });
  });

it('it should NOT POST a course with less than 2 teachers', () => {
  return request(app)
  .post('/api/v1/course')
  .send({ name:"Name2", period:10, city:"City2", teacher:[1]})
  .then(function(res) { 
    assert.equal(res.status, 401);
  }); 
})
});

describe('GET /api/v1/course', function() {
	it('should return OK status for GET ALL', ()=> {
		return request(app)
		.get('/api/v1/course')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

 	 it('should return OK status for GET FILTERED', ()=> {
		return request(app)
		.get('/api/v1/course/1')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return NOT FOUND status for GET FILTERED', ()=> {
		return request(app)
		.get('/api/v1/course/5')
		.then(function(res) {
			assert.equal(res.status, 404)
		});
	});
});

describe('PUT /api/v1/course', function() {
	it('it should PUT a course with more than 2 teachers', () => {
		return request(app)
		.put('/api/v1/course/1')
		.send({ name:"UpdatedName1", period:10, city:"UpdatedCity1", teacher:[1, 2]})
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should NOT PUT a course without more than 2 teachers', () => {
		return request(app)
		.put('/api/v1/course/1')
		.send({ name:"UpdatedName2", period:10, city:"UpdatedCity2", teacher:[1]})
		.then(function(res) { 
			assert.equal(res.status, 401);
		}); 
	});

	it('it should NOT PUT course 2 (not exists)', () => {
		return request(app)
		.put('/api/v1/course/2')
		.send({ name:"CourseNotExists", period:10, city:"CourseNotExists", teacher:[1,2]})
		.then(function(res) { 
			assert.equal(res.status, 401);
		});
	});
});

describe('DELETE /api/v1/course', function() {
	it('it should DELETE course 1', () => {
		return request(app)
		.delete('/api/v1/course/1')
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should NOT DELETE course 2 (not exists)', () => {
		return request(app)
		.delete('/api/v1/course/2')
		.then(function(res) { 
			assert.equal(res.status, 204);
		});
	});
});