var request = require('supertest'),
    express = require('express'),
    nock = require('nock');

var app = require('../app.js');


describe('GET /search/', function() {
  describe('when search text is provided', function() {

    it('returns the tapfinder results in the "bars" and "beers" elements', function(done) {
      nock.load(__dirname + '/../fixtures/p_west.json');
      request(app).get('/search?text=p%20west').expect(200).expect({
        "bars": [
           {
             "name": "The Pour House Westmont",
             "updated_at": "07/20/2015",
             "beers": [
               {
                 "style": "Saison/Farmhouse Ale",
                 "origin": "Baltimore, MD",
                 "name": "Heavy Seas Red Sky at Morning (cask)"
               },
               {
                 "style": "Stout",
                 "origin": "Portland, ME",
                 "name": "Allagash Black"
               },
               {
                 "style": "Belgian Golden/Blonde ...",
                 "origin": "Portland, ME",
                 "name": "Allagash Victor"
               },
               {
                 "style": "Wheat/White/Weizen",
                 "origin": "Portland, ME",
                 "name": "Allagash White"
               },
               {
                 "style": "Saison/Farmhouse Ale",
                 "origin": "Brooklyn, NY",
                 "name": "Brooklyn Sorachi Ace"
               },
               {
                 "style": "Belgian Dark Ale",
                 "origin": "Rio Grande, NJ",
                 "name": "Cape May Devil's Reach"
               },
               {
                 "style": "Pale Ale",
                 "origin": "Atlantic Highlands, NJ...",
                 "name": "Carton HopPun"
               },
               {
                 "style": "Wheat/White/Weizen",
                 "origin": "Abingdon, MD",
                 "name": "DuClaw Funk"
               },
               {
                 "style": "IPA",
                 "origin": "Frederick, MD",
                 "name": "Flying Dog Raging Bitch"
               },
               {
                 "style": "Dubbel",
                 "origin": "Somerdale, NJ",
                 "name": "Flying Fish Belgian Style Dubbel"
               },
               {
                 "style": "Stout",
                 "origin": "Ireland",
                 "name": "Guinness"
               },
               {
                 "style": "Cider",
                 "origin": "Biglerville, PA",
                 "name": "Jack's Granny Smith Hard Cider"
               },
               {
                 "style": "Sour/Wild-Fermented Al...",
                 "origin": "San Marcos, CA",
                 "name": "Lost Abbey Cuvee de Tomme"
               },
               {
                 "style": "Stout",
                 "origin": "Croydon, PA",
                 "name": "Neshaminy Creek Leon"
               },
               {
                 "style": "IPA",
                 "origin": "Lyons, CO",
                 "name": "Oskar Blues G'Knight (Gordon)"
               },
               {
                 "style": "IPA",
                 "origin": "Lyons, CO",
                 "name": "Oskar Blues Deviant"
               },
               {
                 "style": "Pale Ale",
                 "origin": "Middlebury, VT",
                 "name": "Otter Creek Over Easy"
               },
               {
                 "style": "Berliner Weisse",
                 "origin": "Lansdale, PA",
                 "name": "Round Guys Berlinerweisster"
               },
               {
                 "style": "Specialty Beer",
                 "origin": "Portsmouth, NH",
                 "name": "Smuttynose Smuttlabs Granite State Destroyer"
               },
               {
                 "style": "American Strong Ale",
                 "origin": "San Francisco, CA",
                 "name": "Speakeasy Cement Shoes"
               },
               {
                 "style": "IPA",
                 "origin": "Escondido, CA",
                 "name": "Stone RuinTen"
               },
               {
                 "style": "Amber",
                 "origin": "Hershey, PA",
                 "name": "Troegs Hopback"
               },
               {
                 "style": "Wheat/White/Weizen",
                 "origin": "Quebec",
                 "name": "Unibroue Ephemere"
               },
               {
                 "style": "Wheat/White/Weizen",
                 "origin": "Quebec",
                 "name": "Unibroue Blanche de Chambly"
               },
               {
                 "style": "Helles/Keller",
                 "origin": "Downingtown, PA",
                 "name": "Victory Helles Lager"
               },
               {
                 "style": "Wheat/White/Weizen",
                 "origin": "Downingtown, PA",
                 "name": "Victory Mad Kings Weisse"
               },
               {
                 "style": "Amber",
                 "origin": "Philadelphia, PA",
                 "name": "Yards Brawler"
               }
             ]
           }
         ],
         "beers": [
           {
             "name": "Pizza Boy West Shore IPA",
             "origin": "Enola, PA",
             "style": "IPA",
             "bars": [
               {
                 "name": "Watkins Drinkery",
                 "address": "1712 S. 10th St. (between Morris & M...",
                 "updated_at": "07/20/15"
               },
               {
                 "name": "Jerry's Bar",
                 "address": "129 W. Laurel St.\n\t\t\t\t\t\t\t\t\t\t\t\t\t(267) 273-1632\n\t\t\t\t\t\t\t\t\t\t\t\t\t· Visit website\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\tNorthern Liberties\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t",
                 "updated_at": "07/18/15"
               },
               {
                 "name": "CJ's Doghouse",
                 "address": "1555 Sumneytown Pike, Kulpsville, PA...",
                 "updated_at": "07/16/15"
               }
             ],
             "events": []
           }
         ]
       }, done);
    });
  });

  describe('when no search text is provided', function() {
    it('responds with a bad request status', function(done) {
      request(app).get('/search').expect(400, done);
    });
  });
});


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
