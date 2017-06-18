var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MOP' });
});

router.get('/:category', function(req, res, next) {
  res.render('questionnaire', { title: 'MOP' });
});

module.exports = router;
