var _ = require('underscore');
var async = require('async');
var cheerio = require('cheerio');
var express = require('express');
var superagent = require('superagent');
var router = express.Router();

var tapfinderBaseUrl = 'http://www.phillytapfinder.com';

/* GET beer search. */
router.get('/beer', function(req, res, next) {
  if (req.query.search) {
    searchTapfinder(req.query.search, function(response) {
      loadBeers(response, function(results) {
        res.send({ beers: results });
      });
    });
  }
  else {
    res.status(400)
    res.send({ error: 'You must provide a search term in the "search" query parameter' });
  }
});

module.exports = router;

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
            style: $('#tap-detail .tap-list .origin strong:first-child').text()
          };

      callback(null, beerAsJson);
    });
  }
}