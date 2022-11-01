var express = require('express');
var router = express.Router();
const path = require('path');
const {config} = require('../helper/env');


router.get('/', function(req, res, next) {
    console.log(config('app.public_path') + '/static/index.html');
    res.render(path.join(config('app.public_path') + '/static/index.html'));
});


module.exports = router;