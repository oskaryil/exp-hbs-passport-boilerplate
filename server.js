const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const db = require('./config/database');

// ENV
const env = process.env.NODE_ENV || 'development';

// Config
const config = require('./config/constants');

const app = express();

// Views directory
const viewdir = __dirname + '/views/';
// Basedir for static assets
const basedir = __dirname + '/public/';

// Main Index Route
const routes = require('./routes/index');

app.set('views', viewdir);
app.engine(
  'handlebars',
  exphbs({ defaultLayout: 'layout', extname: '.handlebars' })
);
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); // Support JSON Encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
app.use(cookieParser()); // Use cookieparser
app.use(express.static(basedir));
app.use(helmet());
app.use(compression());

// Express Session
app.use(
  session({
    secret: config.site.secret,
    saveUninitialized: true,
    resave: true
  })
);

if (env === 'development') {
  app.use(morgan('dev'));
}

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      const namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Connect Flash
app.use(flash());

// Global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// ASSIGNING ROUTES TO APP
app.use(routes);

app.listen(config.site.port, () => {
  console.log(`${config.site.name} running on port ${config.site.port} 😀 🖥`);
});
