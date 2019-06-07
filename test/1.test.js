const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('Waiting...', function() {
  	this.timeout(12000);
  	before(done => {
    	setTimeout(() => {
      		done();
    	}, 10000);
  	});

  	describe('Testing if collections are empty', function() {
    	it('should return NOT FOUND status for GET ALL USER', ()=> {
      		return request(app)
      		.get('/api/v1/user')
      		.then(function(res) {
        		assert.equal(res.status, 404)
      		});
    	});

    	it('should return NOT FOUND status for GET ALL TEACHER', ()=> {
      		return request(app)
      		.get('/api/v1/teacher')
      		.then(function(res) {
        		assert.equal(res.status, 404)
      		});
    	});

		it('should return NOT FOUND status for GET ALL COURSE', ()=> {
			return request(app)
			.get('/api/v1/course')
			.then(function(res) {
				assert.equal(res.status, 404)
			});
		});

		it('should return NOT FOUND status for GET ALL STUDENT', ()=> {
			return request(app)
			.get('/api/v1/student')
			.then(function(res) {
				assert.equal(res.status, 404)
			});
		});
  	});
});