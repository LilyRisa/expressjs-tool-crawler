var express = require('express');
var router = express.Router();
const path = require('path');
const {config} = require('../helper/env');
const checkToken =  require('../middleware/token');
const IndexController =  require('../controller/index');


router.get('/', function(req, res, next) {
    console.log(config('app.public_path') + '/static/index.html');
    res.render(path.join(config('app.public_path') + '/static/index.html'));
});

router.post('/api/test', checkToken, function(req, res) {
    console.log(req.body);
    return res.end(JSON.stringify({status: false, message: 'Token success', param: req.body}));
});

router.post('/api/view-page', checkToken, IndexController.viewHtml);
router.post('/api/get-story', checkToken, IndexController.get_truyen);
router.post('/api/insert-story', checkToken, IndexController.insert_truyen);
router.post('/api/insert-chapter', checkToken, IndexController.insert_chapter);


module.exports = router;