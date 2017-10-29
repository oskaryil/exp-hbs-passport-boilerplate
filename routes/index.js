const router = require('express').Router();
const UserController = require('../controllers/user.controller.js');
const config = require('../config/constants');
const userRoutes = require('./user.routes');
const indexRoutes = require('./index.routes');

router.use('/', indexRoutes);
router.use('/users', userRoutes);

module.exports = router;
