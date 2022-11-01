const {env} = require('../helper/env');

module.exports = {
    'host' : env('DB_HOST', null),
    'port' : env('DB_PORT', null),
    'database' : env('DB_DATABASE', null),
    'username' : env('DB_USERNAME', null),
    'password' : env('DB_PASSWORD', null),
}