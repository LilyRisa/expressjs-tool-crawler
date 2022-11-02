const {env} = require('../helper/env');
const path = require('path');
module.exports = {
    'url' : env('URL', null),
    'app_name' : env('APP_NAME', null),
}