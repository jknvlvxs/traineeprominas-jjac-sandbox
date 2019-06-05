const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();


chai.use(chaiHttp);

describe('--- TIMEOUT ---', function() {

  this.timeout(12000);

  before(done => {
    setTimeout(() => {
      done();
    }, 10000);
  });

  it('it should POST a user with ok profile', (done) => {
      let user = {
          name: 'Jose',
          lastName: 'Júlio',
          profile: 'admin'
      };
    chai.request(app)
        .post('/api/v1/user')
        .send(user)
        .end((err, res) => {
              // res.should.have.status(200);
              // res.body.should.be.a('object');
              // res.body.should.have.property('errors');
              // res.body.errors.should.have.property('pages');
              // res.body.errors.should.have.property('kind').eql('required');
          done();
        });
  });
});