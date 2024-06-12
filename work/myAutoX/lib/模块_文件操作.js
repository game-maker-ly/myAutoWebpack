// 读取配置文件
// 本地操作
var cache_config = readConfig();
var BASE_URL = cache_config["project_url"];


var cacheMd5 = null;
var cache_shortCutConfig = null;

function readConfig(){
    // 假如配置文件不存在，就手动创建
    var c_path = "config.json";
    var defaultCfg = {
        "version":"1.0",
        "project_url":"https://mirror.ghproxy.com/https://raw.githubusercontent.com/game-maker-ly/myAutoX/main/myAutoX/"
    }
    if(!files.exists(c_path)){
        files.write(c_path, JSON.stringify(defaultCfg));
    }
    return readJson(c_path);
}

function readJson(path) {
    var str = files.read(path);
    return JSON.parse(str);
}

//这个写法是同步下载
function downloadFile_private(srcDir, desDir){
    var url = BASE_URL + srcDir;
    var res = http.get(url);
    // 保存到本地
    if (res.statusCode == 200) {
        files.createWithDirs(desDir);
        files.writeBytes(desDir, res.body.bytes());
        return true;
    }else{
        return false;
    }
}

// 异步下载文件
// 涉及到多个文件，用list传入时调用
async function downloadFile_async(srcDir, desDir){
    var url = BASE_URL + srcDir;
    http.get(url,null, (res) => {
        // 保存到本地
        if (res.statusCode == 200) {
            files.createWithDirs(desDir);
            files.writeBytes(desDir, res.body.bytes());
            return true;
        }else{
            return false;
        }
    });
}

async function downloadFile_async_list(dirList){
    var pmList = [];
    dirList.forEach(d => {
        var promise1 = new Promise((resolve, reject) => {
            var isS = downloadFile_async(d, d);
            if(isS){
                resolve(true);
            }else{
                reject(false);
            }
        });
        pmList.push(promise1);
    });
    // 执行
    Promise.all(pmList).then((values) => {
        // console.log(values);
    });
}

// 获取本地版本号
exports.getLocalVersion = function () {
    return cache_config["version"];
}


exports.downloadFile = function (desDir) {
    downloadFile_private(desDir, desDir);
}

exports.downloadFileList = function (desDirList) {
    downloadFile_async_list(desDirList);
}

exports.downloadFileAndRead = function (srcDir, desDir) {
    var isSucc = downloadFile_private(srcDir, desDir);
    var res = isSucc ? readJson(desDir): null;
    return res;
}



exports.getMd5ByPath = function (path) {
    if (cacheMd5 == null) {
        cacheMd5 = readJson("md5.json");
    }
    if(!(path in cacheMd5)){
        return null;
    }
    return cacheMd5[path];
}

exports.getMd5Json = function () {
    return readJson("md5.json");
}

exports.getAllFilePaths = function () {
    if (cacheMd5 == null) {
        cacheMd5 = readJson("md5.json");
    }
    return Object.keys(cacheMd5);
}

exports.getShortcutConfig = function () {
    // 很迷，为什么会有缓存，
    // 明明Md5也是这么写的，就不会缓存
    cache_shortCutConfig = readJson("shortcutConfig.json");
    return cache_shortCutConfig;
}