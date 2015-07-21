var _ = require('underscore');
var async = require('async');
var cheerio = require('cheerio');
var express = require('express');
var superagent = require('superagent');
var router = express.Router();

var tapfinderBaseUrl = 'http://www.phillytapfinder.com';

/* GET combined search (beer & bars). */
router.get('/', validateSearchText, searchForBars, searchForBeers, sendResults);

/* GET beer search. */
router.get('/beers', validateSearchText, searchForBeers, sendResults);

/* GET bar search. */
router.get('/bars', validateSearchText, searchForBars, sendResults);

module.exports = router;

function validateSearchText(req, res, next) {
  if (req.query.text) {
    next();
  }
  else {
    res.status(400)
    res.send({ error: 'You must provide a search term in the "text" query parameter' });
  }
}

function searchForBeers(req, res, next) {
  searchTapfinder(req.query.text, function(response) {
    loadBeers(response, function(results) {
      res.results = res.results || {};
      res.results['beers'] = results;
      next();
    });
  });
}

function searchForBars(req, res, next) {
  searchTapfinder(req.query.text, function(response) {
    loadBars(response, function(results) {
      res.results = res.results || {};
      res.results['bars'] = results;
      next();
    });
  });
}

function sendResults(req, res, next) {
  res.json(res.results);
}

function searchTapfinder(searchTerm, callback) {
  superagent.post(tapfinderBaseUrl + '/wp-content/plugins/phillytapfinder/')
    .type('form').send({ "class": 'Search', "process": 'searchAll', "searchTerm": searchTerm })
    .end(function(error, response) {
      callback(response.body);
    });
}

function loadBeers(searchResults, callback) {
  var tasks = _.map(searchResults.beers, loadBeer);
  async.parallel(tasks, function(err, results) {
    callback(results);
  });
}

function loadBeer(beer) {
  return function(callback) {
    superagent.get(tapfinderBaseUrl + beer.link).end(function(error, response) {
      var $ = cheerio.load(response.text),
          beerAsJson = {
            name: $('#tap-detail .tap-list .tap-list-name').text(),
            origin: $('#tap-detail .tap-list .origin > strong').text(),
            style: $('#tap-detail .tap-list .origin strong:first-child').text(),
            bars: _.map($('#tap-detail .tap-list .grid-list:nth-of-type(1)').not('.events-panel').find('.panel'), function(bar) {
              var $bar = $(bar);
              return {
                name: $bar.find('h4 a[href^="/bar"]').text(),
                address: $bar.find('li:nth-child(2) p').text(),
                updated_at: $bar.find('.updated').text().replace(/Last Updated:\s+/,'')
              };
            }),
            events: _.map($('#tap-detail .tap-list .grid-list .events-panel'), function(event) {
              var $event = $(event);
              return {
                name: $event.find('h4 a[href^="/event"]').text(),
                bar: $event.find('h4 a[href^="/bar"]').text(),
                date: $event.find('li:nth-child(3) p').text(),
                address: $event.find('li:nth-child(4) p').text()
              };
            }),
          };

      callback(null, beerAsJson);
    });
  }
}

function loadBars(searchResults, callback) {
  var tasks = _.map(searchResults.bars, loadBar);
  async.parallel(tasks, function(err, results) {
    callback(results);
  });
}

function loadBar(bar) {
  return function(callback) {
    superagent.get(tapfinderBaseUrl + bar.link).end(function(error, response) {
      var $ = cheerio.load(response.text),
          barAsJson = {
            name: $('#bar-detail .tap-list .tap-list-name').text(),
            updated_at: $('#bar-detail .tap-list .bar-data .red').text().replace(/Updated:\s+/,''),
            beers: _.map($('#bar-detail .tap-list .grid-list .panel'), function(beer) {
              $beer = $(beer);
              return {
                style: $beer.find('.beer-meta h5:first-child').text().replace(/Style:\s+/,''),
                origin: $beer.find('.beer-meta h5:nth-child(2)').text().replace(/Origin:\s+/,''),
                name: $beer.find('h4 a[href^="/beer"]').text()
              }
            })
          };

      callback(null, barAsJson);
    });
  }
}