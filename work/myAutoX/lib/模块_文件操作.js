// 读取配置文件
// 本地操作
var cache_config = readConfig();
var BASE_URL = cache_config["project_url"];


var cacheMd5 = null;
var cache_shortCutConfig = null;

function readConfig() {
    // 假如配置文件不存在，就手动创建
    var c_path = "config.json";
    var defaultCfg = {
        "version": "1.0",
        "project_url": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/game-maker-ly/myAutoX/main/myAutoX/"
    }
    if (!files.exists(c_path)) {
        files.write(c_path, JSON.stringify(defaultCfg));
    }
    return readJson(c_path);
}

function readJson(path) {
    var str = files.read(path);
    return JSON.parse(str);
}

//这个写法是同步下载
function downloadFile_private(srcDir, desDir) {
    var url = BASE_URL + srcDir;
    var res = http.get(url);
    // 保存到本地
    if (res.statusCode == 200) {
        files.createWithDirs(desDir);
        files.writeBytes(desDir, res.body.bytes());
        return true;
    } else {
        return false;
    }
}


function downloadFile_async_list(dirList) {
    // 不能用async/await
    // get的回调不兼容Promise
    // 仅在autojs4版本有这个问题，之后的版本都正常
    let size = dirList.length;
    for (let i = 0; i < size; i++) {
        var srcDir = dirList[i];
        var url = BASE_URL + srcDir;
        // toastLog(url);
        // 有bug，暂时重复广播实现
        http.get(url, null, (res) => {
            // 保存到本地
            if (res.statusCode == 200) {
                // srcDir恒为数组最后一项
                // 但是i在变化，可能和变量作用域有关
                var desDir = dirList[i];
                files.createWithDirs(desDir);
                files.writeBytes(desDir, res.body.bytes());
                log("下载成功："+desDir);
                events.broadcast.emit("isFileListDownloaded", size);
            } else {
                toastLog("下载失败！");
            }
            // 重复广播给主线程，如果达到列表数目，就认为完成
            // 执行退出
        });
    }
}

// 获取本地版本号
exports.getLocalVersion = function () {
    return cache_config["version"];
}


exports.downloadFile = function (desDir) {
    downloadFile_private(desDir, desDir);
}

exports.downloadFileList_Async = function (desDirList) {
    toastLog("开始异步下载");
    downloadFile_async_list(desDirList);
}

exports.downloadFileAndRead = function (srcDir, desDir) {
    var isSucc = downloadFile_private(srcDir, desDir);
    var res = isSucc ? readJson(desDir) : null;
    return res;
}



exports.getMd5ByPath = function (path) {
    if (cacheMd5 == null) {
        cacheMd5 = readJson("md5.json");
    }
    if (!(path in cacheMd5)) {
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