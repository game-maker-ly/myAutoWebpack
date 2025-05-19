// 读取配置文件
// 本地操作
var cache_config;
var BASE_URL;
const CONFIG_URL = "http://541378.xyz/@http://raw.githubusercontent.com/game-maker-ly/myAutoX/main/myAutoX/config.json";


var cacheMd5 = null;
var cache_shortCutConfig = null;

function readConfig() {
    // 假如配置文件不存在，就手动创建
    var c_path = "config.json";
    var defaultCfg = {
        "version": "1.0",
        "project_url": CONFIG_URL
    }
    if (!files.exists(c_path)) {
        files.write(c_path, JSON.stringify(defaultCfg));
    }
    return readJson(c_path);
}

// 检测config是否有效
function checkConfig(srcDir){
     if (!cache_config) {
        cache_config = readConfig();
    }
    // 如果是下载配置文件，则固定BaseURL;
    if (srcDir && srcDir.indexOf("config") != -1) {
        BASE_URL = CONFIG_URL;
    } else {
        BASE_URL = cache_config["project_url"];
    }
}

function readJson(path) {
    var str = files.read(path);
    return JSON.parse(str);
}

//这个写法是同步下载
function downloadFile_private(srcDir, desDir) {
    // 未初始化则去配置文件中读取
    checkConfig(srcDir)

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


var lock = false;
function downloadFile_async_list(dirList, callBack_Func) {
    // 不能用async/await
    // get的回调属于okhttp框架下的代码
    // 不受autojs管理，不能在此中断线程以及抛出resolve
    // 仅在autojs4版本有这个问题，之后的版本都正常
    let size = dirList.length;
    let pList = [];
    for (let i = 0; i < size; i++) {
        var srcDir = dirList[i];
         // 未初始化则去配置文件中读取
        checkConfig(srcDir)
        var url = BASE_URL + srcDir;
        // 抛出resolve需要在ui线程
        // 使用普通线程有概率无法生效
        var p1 = new Promise((resolve, reject) => {
            http.get(url, {}, (res) => {
                // resolve必须另起线程才生效
                ui.run(function () {
                    // 保存到本地
                    if (res.statusCode == 200) {
                        // srcDir恒为数组最后一项
                        // 但是i在变化，可能和变量作用域有关
                        var desDir = dirList[i];
                        files.createWithDirs(desDir);
                        files.writeBytes(desDir, res.body.bytes());
                        log("下载成功：" + desDir);
                        resolve(true);
                    } else {
                        log("下载失败！");
                        reject(false);
                    }
                });
            });
        });
        pList.push(p1);
    }
    Promise.all(pList).then(() => {
        log("所有文件下载完毕");
    }).catch(() => {
        log("下载出错");
    }).finally(() => {
        log("异步下载流程结束");
        // 需要注意的是，主线程后面的代码不是同步的，需要用回调表明哪里下载完毕了
        callBack_Func && callBack_Func();
        // 释放阻塞线程
        lock = false;
    });

    lock = true;
    threads.start(function () {
        while (lock);
    });
}

// 获取本地版本号
exports.getLocalVersion = function () {
    return cache_config["version"];
}


exports.downloadFile = function (desDir) {
    downloadFile_private(desDir, desDir);
}

exports.downloadFileList_Async = function (desDirList, callback_Func) {
    log("开始异步下载");
    downloadFile_async_list(desDirList, callback_Func);
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