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
          style: 'Sour/Wild-Fermented Ale',
          bars: [{
            name: 'Tria Taproom',
            address: '2005 Walnut Street',
            updated_at: '07/20/15'
          }],
          events: []
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

describe('GET /bar', function() {
  this.timeout(4000);

  describe('when search text is provided', function() {
    it('responds with a success status', function(done) {
      request(app).get('/bar?search=wrap%20shack').expect(200, done);
    });

    it('returns the tapfinder results in the "bars" element', function(done) {
      request(app).get('/bar?search=wrap%20shack').expect({
        bars: [{
          name: 'Wrap Shack',
          updated_at: '07/18/2015',
          beers: [
            {
              "style": "Wheat/White/Weizen",
              "origin": "Portland, ME",
              "name": "Allagash White"
            },
            {
              "style": "Barleywine",
              "origin": "Boulder, CO",
              "name": "Avery Hog Heaven"
            },
            {
              "style": "Wheat/White/Weizen",
              "origin": "Comstock, MI",
              "name": "Bell's Oberon"
            },
            {
              "style": "American Strong Ale",
              "origin": "Petaluma, CA",
              "name": "Lagunitas Equinox"
            },
            {
              "style": "Specialty Beer",
              "origin": "Chippewa Falls, WI",
              "name": "Leinenkugels Summer Shandy"
            },
            {
              "style": "Bock",
              "origin": "Pottsville, PA",
              "name": "Yuengling Lager"
            }
          ]
        }]
      }, done);
    });
  });

  describe('when no search text is provided', function() {
    it('responds with a bad request status', function(done) {
      request(app).get('/bar').expect(400, done);
    });
  });
});
