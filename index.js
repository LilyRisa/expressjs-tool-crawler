var express = require('express');
var path = require('path');
require('dotenv').config();
var indexRouter = require('./routes/index');
var {config} = require('./helper/env');
var http = require('http');
const multer  = require('multer');

const port = 4000;
var app = express();
var httpsServer = http.createServer(app);
httpsServer.listen(port, () => {
    console.log("server starting on port : " + port);
  });


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().array());
app.use('/', indexRouter);
// app.use(express.json());