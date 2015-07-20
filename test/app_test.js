var request = require('supertest'),
    express = require('express');

var app = require('../app.js');

describe('GET /beer', function() {
  it('responds with a success status', function(done) {
    request(app).get('/beer').expect(200, done);
  });
});
