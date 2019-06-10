const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../app');

describe('POST /api/v1/teacher', function() {
  it('it should POST a teacher with "phd=true"', () => {
    return request(app)
    .post('/api/v1/teacher')
    .send({ name: "Name1", lastName: "LastName1", phd:true })
    .then(function(res) { 
        assert.equal(res.status, 201);
          request(app)
          .post('/api/v1/teacher')
          .send({ name: "Name2", lastName: "LastName2", phd:true })
          .then(function(res) { 
              assert.equal(res.status, 201);
          });
    });
  });

it('it should NOT POST a teacher with "phd=false"', () => {
  return request(app)
  .post('/api/v1/teacher')
  .send({ name: "Name3", lastName: "LastName3", phd:false })
  .then(function(res) { 
    assert.equal(res.status, 401);
  }); 
})
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

describe('PUT /api/v1/teacher', function() {
	it('it should PUT a teacher with "phd=true"', () => {
		return request(app)
		.put('/api/v1/teacher/1')
		.send({ name: "UpdatedName1", lastName: "UpdatedLastName1", phd:true })
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should PUT a second teacher with "phd=true"', () => {
		return request(app)
		.put('/api/v1/teacher/2')
		.send({ name: "UpdatedName2", lastName: "UpdatedLastName2", phd:true })
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should NOT PUT a teacher without "phd=true"', () => {
		return request(app)
		.put('/api/v1/teacher/1')
		.send({ name: "UpdatedName3", lastName: "UpdatedLastName3", phd:false })
		.then(function(res) { 
			assert.equal(res.status, 401);
		}); 
	});

	it('it should NOT PUT teacher 3 (not exists)', () => {
		return request(app)
		.put('/api/v1/teacher/3')
		.send({ name: "TeacherNotExists", lastName: "TeacherNotExists", phd:true })
		.then(function(res) { 
			assert.equal(res.status, 401);
		});
	});
});

describe('DELETE /api/v1/teacher', function() {
	it('it should DELETE teacher 1', () => {
		return request(app)
		.delete('/api/v1/teacher/1')
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should DELETE teacher 2', () => {
		return request(app)
		.delete('/api/v1/teacher/2')
		.then(function(res) { 
			assert.equal(res.status, 200);
		});
	});

	it('it should NOT DELETE teacher 3 (not exists)', () => {
		return request(app)
		.delete('/api/v1/teacher/3')
		.then(function(res) { 
			assert.equal(res.status, 204);
		});
	});
});