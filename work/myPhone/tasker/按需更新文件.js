// 这个版本不需要更新快捷方式，因为改nova桌面太麻烦了
// 后续再考虑实时更新，目前手动维护即可，没有频繁更新的必要
const FileTool = require("../lib/模块_文件操作.js");
const DeviceTool = require("../lib/模块_设备操作.js");
log("执行更新主流程");
log("开始下载");
// 首先检查本地是否存在md5.json，
// 如果不存在就跳过md5检查，直接下载所有文件，从云端
var dirPath = "md5.json";
var isMD5Exists = files.exists(dirPath);

//let eventsCount = 0;
events.broadcast.on("isFileListDownloaded", function () {
    //eventsCount = eventsCount + 1;
    //if (eventsCount == size) {
    log("文件列表下载完成！");
    if (isMD5Exists) {
        log("已更新：" + m_count + "个文件");
        var count = 0;
        for (l_path in localMd5) {
            // 如果云端md5文件没有对应的key，说明要删除
            if (!(l_path in cloudMd5)) {
                files.remove(l_path);
                count++;
            }
        }
        log("已删除：" + count + "个文件");
        // 完成后把云端的md5覆盖到本地
        // cloud文件删不删都不影响，没必要在其他地方加
        // 只需要保证md5和config文件本身正确即可
        files.remove(dirPath);
        files.rename(cloudPath, dirPath);
    }
    // 创建快捷方式
    // engines.execScriptFile("tasker/更新桌面布局.js");
    // 清除定时器并强制退出
    //clearInterval(myInterval);
    exit();
    // }
});

// 注册销毁，释放引擎
events.on("exit", function () {
   log("按需更新文件已exit");
});

var dlFile_count = 0;
var t_lock_flag = false;
var needUpdateFiles = [];
var t_lock = threads.start(function () {
    t_lock_flag = true;
    // 异步代码开始
    // 如果md5文件不存在，就直接下载全部
    if (!isMD5Exists) {
        FileTool.downloadFile(dirPath);
        var flist = FileTool.getAllFilePaths();
        // log(flist);
        needUpdateFiles = flist;
    } else {
        // 如果md5文件存在，就和云端上的md5文件作对比
        // 下载云端的md5
        var cloudPath = "md5_cloud.json";
        var cloudMd5 = FileTool.downloadFileAndRead(dirPath, cloudPath);
        var localMd5 = FileTool.getMd5Json();
        // 最好还是写个对比两个json的方法
        // 如果是删除了文件，那么云端没有对应的key
        // 那实际上还是会遍历两遍
        var m_count = 0;

        for (path in cloudMd5) {
            var md5val = cloudMd5[path];
            var md5val_old = FileTool.getMd5ByPath(path);
            if (md5val != md5val_old) {
                // 执行下载/更新
                // 不过有一种情况，云端文件改名或者删除了的话
                // 客户端没法做操作
                // 此处说明需要新增或者修改
                // FileTool.downloadFile(path);
                needUpdateFiles.push(path);
                m_count++;
            }
        }
    }
    // 计数需要更新文件数
    dlFile_count = needUpdateFiles.length;
    log("需要更新文件数为：" + dlFile_count);
    // 如果可下载文件数为0，不会发送广播，那么会导致一直阻塞，需要做个if判断
    if (dlFile_count == 0) {
        // 直接更新布局
        // 然后退出当前脚本
        // log("无可更新文件，直接开始更新桌面布局。。。");
        // engines.execScriptFile("tasker/更新桌面布局.js");
        //强制退出
        exit();
    } else {
        FileTool.downloadFileList_Async(needUpdateFiles, function () {
            t_lock_flag = false; // 释放线程所
        });
    }
    // 异步代码结束
    // 播报语音不能放在主线程，否则会被阻塞
    while (t_lock_flag) { }
});
t_lock.join();// 子线程阻塞主线程


// 有概率卡住，无法复现
// const myInterval = setInterval(() => {
//     log("执行主线程更新文件阻塞");
// }, 10000);

// 做个超时处理，假设30s超时
// 一般情况下10s内能下完所有文件
setTimeout(() => {
    // 锁屏
    log("更新文件超时，执行锁屏");
    DeviceTool.cancelWakeUpAndLock();
    // 仅清除定时器无法退出
    // clearInterval(myInterval);
    exit();
}, 30 * 1000);

