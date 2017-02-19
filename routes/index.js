const express = require('express');
const router = express.Router();

const config = require('../config.json');

router.get('/', function(req, res) {
  res.render('index', {
    title: config.site.name
  });
});

