const fs = require('fs').promises;
const path = require('path');

var fileTool = {};

// 暂存变量？
// 每次调用list必须重置
var res = [];
var BASE_DIR = null;

// 递归遍历
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
    res = [];// 这里不是重置了么
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

// 异步操作必须转同步
async function saveMd5JsonAsync(data) {
    // 备份操作目前来看意义不大，先放弃
    // 验证文件存在总要报错，算了
    var md5_path = path.join(BASE_DIR, 'md5.json');
    console.log("已保存md5文件至："+BASE_DIR);

    await fs.writeFile(md5_path, data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

fileTool.saveMd5Json = async function (data) {
    await saveMd5JsonAsync(data);
}


module.exports = fileTool;