var express = require('express');
var router = express.Router();

/* GET beer search. */
router.get('/beer', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
