var express = require('express');
var path = require('path');
require('dotenv').config();
var indexRouter = require('./routes/index');


var corsOptions = {
    origin: "http://localhost:8081"
};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log("server starting on port : " + port)
});

var app = express();
app.use(cors(corsOptions));
app.use(express.json());