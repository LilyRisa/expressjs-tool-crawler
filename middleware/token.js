const mysql = require("mysql2/promise");
const DB = require('../helper/DB');

checkToken = async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    if(typeof req.headers['token'] === 'undefined'){
        return res.end(JSON.stringify({status: false, message: 'Token invalid'}));
    }
    let data = await DB.table('token_api').where('token', req.headers['token']).first();

    if(data == null){
        return res.end(JSON.stringify({status: false, message: 'Token invalid'}));
    }

    next();
}


module.exports = checkToken;