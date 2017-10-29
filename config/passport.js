const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GithubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const configAuth = require('../config/constants').site;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: 'Unknown User' });
        }

        User.comparePassword(password, user.local.password, function(
          err,
          isMatch,
        ) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid password' });
          }
        });
      });
    }),
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: configAuth.oAuth.facebookAuth.clientID,
        clientSecret: configAuth.oAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.oAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name'],
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ 'facebook.id': profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              const newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.facebook.token = accessToken;
              newUser.facebook.name =
                profile.name.givenName + ' ' + profile.name.familyName;
              newUser.facebook.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.name =
                profile.name.givenName + ' ' + profile.name.familyName;
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
              console.log(profile);
            }
          });
        });
      },
    ),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.oAuth.googleAuth.clientID,
        clientSecret: configAuth.oAuth.googleAuth.clientSecret,
        callbackURL: configAuth.oAuth.googleAuth.callbackURL,
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ 'google.id': profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              const newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = accessToken;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.name = profile.displayName;
              newUser.imgUrl = profile.photos[0].value;
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
              console.log(profile);
            }
          });
        });
      },
    ),
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: configAuth.oAuth.githubAuth.clientID,
        clientSecret: configAuth.oAuth.githubAuth.clientSecret,
        callbackURL: configAuth.oAuth.githubAuth.callbackURL,
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ 'github.id': profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              const newUser = new User();
              newUser.github.id = profile.id;
              newUser.github.token = accessToken;
              newUser.github.name = profile.displayName;
              if (profile.emails != undefined) {
                newUser.github.email = profile.emails[0].value;
                newUser.email = profile.emails[0].value;
              } else {
                newUser.email = '';
                newUser.github.email = '';
              }
              newUser.name = profile.displayName;
              newUser.imgUrl = profile.photos[0].value || '';
              newUser.github.username = profile.username;
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      },
    ),
  );
};
