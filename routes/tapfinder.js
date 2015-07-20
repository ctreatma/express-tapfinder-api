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

      console.log(beerAsJson);
      callback(null, beerAsJson);
    });
  }
}