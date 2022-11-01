var express = require('express');
var path = require('path');
require('dotenv').config();
var indexRouter = require('./routes/index');
var {config} = require('./helper/env');
const mysql = require("mysql2/promise");

var http = require('http');

const port = 4000;
var app = express();
var httpsServer = http.createServer(app);
httpsServer.listen(port, () => {
    console.log("server starting on port : " + port);
  });

  const CONFIG_DB = {
    host: config('database.host'),
    user: config('database.username'),
    password: config('database.password'),
    database: config('database.database'),
    port: config('database.port'),
  }

mysql.createConnection(CONFIG_DB).then( data => {
  if(data){
      console.log('connected database !');
  }else{
      console.log('not connected database !');
      return 0;
  }
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'))
app.use('/', indexRouter);

app.use(express.json());