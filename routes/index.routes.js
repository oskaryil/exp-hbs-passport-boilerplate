const router = require('express').Router();
const config = require('../config/constants');

router.get('/', function(req, res) {
  res.render('index', {
    title: config.site.name,
    user: req.user,
  });
});

module.exports = router;
