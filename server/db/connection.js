const monk = require('monk');
const db = monk('localhost/auth-forNewbs');

module.exports = db;
