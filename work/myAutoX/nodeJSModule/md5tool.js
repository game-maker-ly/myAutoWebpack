const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

var md5tool={}
md5tool.getMd5 = function(path){
    const buffer = fs.readFileSync(path);
    const hash = crypto.createHash('md5');
    hash.update(buffer, 'utf8');
    const md5 = hash.digest('hex');
    return md5
}


module.exports = md5tool;
