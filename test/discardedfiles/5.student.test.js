const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../app');

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

describe('GET /api/v1/student', function() {
	it('should return OK status for GET ALL', ()=> {
		return request(app)
		.get('/api/v1/student')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return OK status for GET ALL', ()=> {
		return request(app)
		.get('/api/v1/student/1')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return NOT FOUND status for GET ALL', ()=> {
		return request(app)
		.get('/api/v1/student/5')
		.then(function(res) {
			assert.equal(res.status, 404)
		});
	});
});

describe('PUT /api/v1/student', function() {
	it('it should PUT a student with "age >= 17" and valid course', () => {
		return request(app)
		.put('/api/v1/student/1')
		.send({ name: "UpdatedName1", lastName: "UpdatedLastName1", age: 18, course:[1] })
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should NOT PUT a user without "age >= 17" even if he is on a valid course', () => {
		return request(app)
		.put('/api/v1/student/1')
		.send({ name: "UpdatedName2", lastName: "UpdatedLastName2", age: 16, course:[1] })
		.then(function(res) { 
			assert.equal(res.status, 401);
		}); 
	});

	it('it should NOT PUT a user without a valid course even if he have "age >= 17"', () => {
		return request(app)
		.put('/api/v1/student/1')
		.send({ name: "UpdatedName3", lastName: "UpdatedLastName3", age: 18, course:[2] })
		.then(function(res) { 
			assert.equal(res.status, 401);
		}); 
	});

	it('it should NOT PUT a user without "age >= 17" and a valid course', () => {
		return request(app)
		.put('/api/v1/student/1')
		.send({ name: "UpdatedName4", lastName: "UpdatedLastName4", age: 16, course:[2] })
		.then(function(res) { 
			assert.equal(res.status, 401);
		}); 
	})

	it('it should NOT PUT student 2 (not exists)', () => {
		return request(app)
		.put('/api/v1/student/2')
		.send({ name: "StudentNotExists", lastName: "StudentNotExists", age: 18, course:[1] })
		.then(function(res) { 
			assert.equal(res.status, 401);
		});
	});
});

describe('DELETE /api/v1/student', function() {
	it('it should DELETE student 1', () => {
		return request(app)
		.delete('/api/v1/student/1')
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should NOT DELETE student 2 (not exists)', () => {
		return request(app)
		.delete('/api/v1/student/2')
		.then(function(res) { 
			assert.equal(res.status, 204);
		});
	});
});