// 只下载有变动的文件，依据文件的路径+md5值来进行判断
// 下载完毕后，执行重置桌面布局
// 并创建快捷方式
// 生成md5值的动作在云端
// 本地的md5值到底该怎么办？
// 理论上不用生成
// 用个cache来缓存即可
// 文件路径：md5
// autojs语法
/// 此文件每次更新都会从云端请求(当版本号不一致时)
// 达到热更的目的，所以也无需记录md5
const FileTool = require("../lib/模块_文件操作.js");
const DeviceTool = require("../lib/模块_设备操作.js");
log("执行更新主流程");
log("开始下载");
// 首先检查本地是否存在md5.json，
// 如果不存在就跳过md5检查，直接下载所有文件，从云端
var dirPath = "md5.json";
var isMD5Exists = files.exists(dirPath);


// 如果md5文件不存在，就直接下载全部
var dl_Files;
var localMd5;
var cloudMd5;
var m_count = 0;

// 注册销毁，释放引擎
var isNeedLock = true;
events.on("exit", function () {
    log("按需更新文件已exit");
    if(isNeedLock){
        DeviceTool.cancelWakeUpAndLock();
    }
});

var t_lock_flag = false;
var t_lock = threads.start(function () {
    t_lock_flag = true;
    // 异步代码开始
    if (!isMD5Exists) {
        FileTool.downloadFile(dirPath);
        dl_Files = FileTool.getAllFilePaths();
    } else {
        // 如果md5文件存在，就和云端上的md5文件作对比
        // 下载云端的md5
        var cloudPath = "md5_cloud.json";
        cloudMd5 = FileTool.downloadFileAndRead(dirPath, cloudPath);
        localMd5 = FileTool.getMd5Json();
        // 最好还是写个对比两个json的方法
        // 如果是删除了文件，那么云端没有对应的key
        // 那实际上还是会遍历两遍
        var needUpdateFiles = [];
        for (path in cloudMd5) {
            var md5val = cloudMd5[path];
            var md5val_old = FileTool.getMd5ByPath(path);
            if (md5val != md5val_old) {
                // 执行下载/更新
                // 不过有一种情况，云端文件改名或者删除了的话
                // 客户端没法做操作
                // 此处说明需要新增或者修改
                needUpdateFiles.push(path);
                m_count++;
            }
        }
        // 异步并发更新文件
        dl_Files = needUpdateFiles;
    }
    // 如果可下载文件数为0，不会发送广播，那么会导致一直阻塞，需要做个if判断
    if (dl_Files.length == 0) {
        // 直接更新布局
        // 然后退出当前脚本
        log("无可更新文件，跳过此次更新。。。");
        // isNeedLock = false; // 锁屏交给下一个脚本
        // engines.execScriptFile("tasker/更新桌面布局.js");
        //强制退出
        exit();
    } else {
        FileTool.downloadFileList_Async(dl_Files, () => {
            // log("文件列表下载完成！");
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
            isNeedLock = false; // 锁屏交给下一个脚本
            engines.execScriptFile("tasker/更新桌面布局.js");
            // 强制退出
            t_lock_flag = false;    // 释放线程锁
            exit();
        });
    }
    // 异步代码结束
});
t_lock.join();// 子线程阻塞主线程


// 由于前面的下载文件是异步操作，后面的setTimeOut不会等到下载完毕才执行
// 这个脚本可能不会处理!!!
// 做个超时处理，假设30s超时
// 一般情况下10s内能下完所有文件
setTimeout(() => {
    // 锁屏
    log("更新文件超时，执行锁屏");
    // 仅清除定时器无法退出
    // clearInterval(myInterval);
    exit();
}, 30 * 1000);