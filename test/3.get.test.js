const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('GET /api/v1/user', function() {
	it('should return OK status for GET ALL', ()=> {
		return request(app)
		.get('/api/v1/user')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return OK status for GET FILTERED', ()=> {
		return request(app)
		.get('/api/v1/user/1')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return a NOT FOUND status for GET FILTERED', ()=> {
		return request(app)
		.get('/api/v1/user/5')
		.then(function(res) {
			assert.equal(res.status, 404)
		});
	});
});

describe('GET /api/v1/teacher', function() {
	it('should return OK status for GET ALL', ()=> {
		return request(app)
		.get('/api/v1/teacher')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return OK status for GET FILTERED', ()=> {
		return request(app)
		.get('/api/v1/teacher/1')
		.then(function(res) {
			assert.equal(res.status, 200)
		});
	});

	it('should return NOT FOUND status GET FILTERED', ()=> {
		return request(app)
		.get('/api/v1/teacher/5')
		.then(function(res) {
			assert.equal(res.status, 404)
		});
	});
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