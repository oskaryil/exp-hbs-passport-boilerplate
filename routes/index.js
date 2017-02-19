const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const config = require('../config.json');

router.get('/', function(req, res) {
  res.render('index', {
    title: config.site.name,
    user: req.user
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login | ' + config.site.name 
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Sign up | ' + config.site.name 
  });
});

// POST
// router.post('/locallogin', passport.authenticate('local', {
//     failureRedirect:'/login',
//     failureFlash: true
//   }), function(req, res, next) {
//   console.log('success');
//   res.redirect('/');
// });

router.post('/locallogin', function(req, res, next) {
  req.assert('username', 'Username can\'t be empty').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();


  const errors = req.validationErrors();
  if (errors) {
    res.render('login', {
      errors: errors
    });
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    
    if (err) { return next(err); }
    if (!user) {
      req.flash('error_msg', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success_msg', 'Success! You are logged in.');
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
});


router.post('/register', function(req, res, next) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const email = req.body.email;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      title: 'Sign up | ' + config.site.name,
      errors: errors
    });
  } else {
    var newUser = new User();
    newUser.local.name = name;
    newUser.local.email = email;
    newUser.email = email;
    newUser.name = name;
    newUser.username = username;
    newUser.local.username = username;
    newUser.local.password = password;

    User.createUser(newUser, function(err, user) {
      if(err) return next(err);
    });

    req.flash('success_msg', 'You are registered and can now log in');
    res.redirect('/');
  }
 
});

module.exports = router;