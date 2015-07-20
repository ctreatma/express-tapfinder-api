var request = require('supertest'),
    express = require('express');

var app = require('../app.js');

describe('GET /beer', function() {
  this.timeout(4000);

  describe('when search text is provided', function() {
    it('responds with a success status', function(done) {
      request(app).get('/beer?search=consecration').expect(200, done);
    });

    it('returns the tapfinder results in the "beers" element', function(done) {
      request(app).get('/beer?search=consecration').expect({
        beers: [{
          name: 'Russian River Consecration',
          origin: 'Santa Rosa, CA',
          style: 'Sour/Wild-Fermented Ale'
        }]
      }, done);
    });
  });

  describe('when no search text is provided', function() {
    it('responds with a bad request status', function(done) {
      request(app).get('/beer').expect(400, done);
    });
  });
});
