const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      index: {
        unique: true,
      },
    },
    username: {
      type: String,
      index: {
        unique: true,
      },
      default: '',
    },
    imgUrl: {
      type: String,
      default: 'https://s3.amazonaws.com/whisperinvest-images/default.png',
    },
    admin: {
      type: Boolean,
      default: false,
    },
    ip: {
      type: String,
    },
    local: {
      username: {
        type: String,
        index: {
          unique: true,
          dropDups: true,
        },
      },
      password: {
        type: String,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String,
    },
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String,
    },
    github: {
      id: String,
      token: String,
      email: String,
      name: String,
      username: String,
    },
  },
  { timestamps: true },
);

UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
});

const User = (module.exports = mongoose.model('User', UserSchema));

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.local.password, salt, function(err, hash) {
      newUser.local.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback); // findOne() is a mongoose function that takes query as argument
};

module.exports.getUserById = function(id, callback) {
  User.findOne(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
