/*
 * Database configuration
 */

const mongoose = require('mongoose');
const constants = require('./constants');

mongoose.Promise = global.Promise;

try {
	mongoose.connect(constants.MONGO_URL, { useMongoClient: true})
} catch (err) {
	mongoose.createConnection(constants.MONGO_URL, { useMongoClient: true})
}
