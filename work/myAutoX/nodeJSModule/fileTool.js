const fs = require('fs').promises;
const { fail } = require('assert');
const path = require('path');

// 递归遍历
var fileTool = {};

var res = [];
var cacheJson = {};
var BASE_DIR = null;



async function traverseDirectory(dir) {
    try {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                // 处理子目录
                await traverseDirectory(filePath);
            } else {
                // 处理文件
                res.push(filePath);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


fileTool.listFiles = async function (dir) {
    // 用绝对路径
    if(path.isAbsolute(dir)){
        BASE_DIR = dir;
    }else{
        BASE_DIR = path.resolve(dir);
    }
    console.log("当前工程绝对路径为："+BASE_DIR);
    res = [];
    await traverseDirectory(BASE_DIR);
    return res;
}

fileTool.getRelativePath = function(absPath){
    if(path.isAbsolute(absPath)){
        absPath = path.relative(BASE_DIR, absPath);
    }
    return absPath.replace("\\", "/");
}

async function isFileExistsAsync(path){
    var isExists = true
    await fs.access(path, fs.constants.F_OK, (err) => {
        if(err){
            isExists = false;
        }
    });
    return isExists;
}

function isFileExists(path) {
    try {
       return isFileExistsAsync(path);
    } catch (e) {
        return false;
    }
}
async function backMd5Json(){
    // 备份旧的
    var md5_path = path.join(BASE_DIR, 'md5.json');
    var isMd5Exists = await isFileExists(md5_path);
    console.log(md5_path);
    console.log(isMd5Exists);

    if (isMd5Exists) {
        await fs.copyFile(md5_path, './md5_old.json', fs.constants.COPYFILE_FICLONE, (err) => {
            if (err) throw err;
            console.log('文件拷贝成功!');
        });
    }
}


async function saveMd5JsonAsync(data) {
    // 备份操作目前来看意义不大，先放弃
    // 验证文件存在总要报错，算了
    var md5_path = path.join(BASE_DIR, 'md5.json');

    await fs.writeFile(md5_path, data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

fileTool.saveMd5Json = function (data) {
    saveMd5JsonAsync(data);
}

function readMd5Json() {
    var md5_path = path.join(BASE_DIR, 'md5.json');
    fs.readFile(md5_path, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        // parse JSON object
        const res = JSON.parse(data.toString());
        return res;
    });
}

fileTool.getMd5ByPath = function (path) {
    if (cacheJson == {}) {
        cacheJson = readMd5Json();
    }
    return cacheJson[path];
}

module.exports = fileTool;