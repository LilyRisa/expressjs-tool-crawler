var fs = require('fs');
const DB = require('./DB');
const {config} = require('./env');
const FormData = require('form-data');
const axios = require('axios');

const checkslugorigin = (slug) => {
    let data = slug.split('');
    if(data[data.length-1] == '0'){
        delete data[data.length-1];
    }
    return data.join('');
}

const slugify = (string) => {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd')
        .replace(/\s+/g, '-') 
        .replace(p, c => b.charAt(a.indexOf(c)))
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

const movefile = async(url, dest) => {
    url = 'https:'+url;

    let filename = url.split('/');
    filename = filename[filename.length - 1];

    let token = await DB.table('token_api').first();
    const form = new FormData();
    form.append('image', url);
    form.append('filename', filename);
    console.log(url, filename, token);
    try{
        let data = await axios({
            method: 'post',
            url: config('api.url')+'/api/upload-img-via-url',
            data: form,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
                'token': token.token,
            },
        });
        return typeof data.data.path == 'undefined' ? '' : data.data.path;
    }catch (error) {
        console.error(error.response.data);     // NOTE - use "error.response.data` (not "error")
        return '';
    }
    
    
}


module.exports = {
    checkslugorigin,
    slugify,
    movefile
}