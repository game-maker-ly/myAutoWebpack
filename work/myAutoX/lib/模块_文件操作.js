// 读取配置文件
// 本地操作
var cache_config = readConfig();
var BASE_URL = cache_config["project_url"];


var cacheMd5 = null;
var cache_shortCutConfig = null;

function readConfig(){
    // 假如文件不存在，就手动创建
    var c_path = "config.json";
    var defaultCfg = {
        "version":"1.0",
        "project_url":"http://192.168.1.29:5500/dist/myAutoX/"
    };
    if(!files.exists(c_path)){
        files.write(c_path, JSON.stringify(defaultCfg));
    }
    return readJson(c_path);
}

function readJson(path) {
    var str = files.read(path);
    return JSON.parse(str);
}

function downloadFile_private(srcDir, desDir){
    var url = BASE_URL + srcDir;
    var res = http.get(url);
    // 保存到本地
    if (res.statusCode == 200) {
        files.createWithDirs(desDir);
        files.writeBytes(desDir, res.body.bytes());
    }
}

// 获取本地版本号
exports.getLocalVersion = function () {
    return cache_config["version"];
}


exports.downloadFile = function (desDir) {
    downloadFile_private(desDir, desDir);
}

exports.downloadFileAndRead = function (srcDir, desDir) {
    downloadFile_private(srcDir, desDir);
    return readJson(desDir);
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
    if(cache_shortCutConfig == null){
        cache_shortCutConfig = readJson("shortcutConfig.json");
    }
    return cache_shortCutConfig;
}