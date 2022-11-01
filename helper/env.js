require('dotenv').config({path:__dirname+'/./../.env'});

const load = (key, default_value)=>{
    if(key in process.env){
        return process.env[key];
    }else{
        return default_value;
    }
}

const get_config = (key) => {

    let filename = key.split('.')[0];
    if(filename.length < 2) return null;
    eval(`var ${filename} = require('../config/${filename}.js');`);
    if(eval( "typeof " + key ) !== 'undefined'){
        return eval(key);
    }
    return null;
}

module.exports = {env : load, config : get_config};