var request = require('supertest'),
    express = require('express'),
    nock = require('nock');

var app = require('../app.js');

describe('GET /search/beers', function() {

  describe('when search text is provided', function() {

    it('returns the tapfinder results in the "beers" element', function(done) {
      nock.load(__dirname + '/../fixtures/consecration.json');
      request(app).get('/search/beers?text=consecration').expect(200).expect({
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
      request(app).get('/search/beers').expect(400, done);
    });
  });
});

describe('GET /search/bars', function() {

  describe('when search text is provided', function() {
    it('returns the tapfinder results in the "bars" element', function(done) {
      nock.load(__dirname + '/../fixtures/wrap_shack.json')
      request(app).get('/search/bars?text=wrap%20shack').expect(200).expect({
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
      request(app).get('/search/bars').expect(400, done);
    });
  });
});
