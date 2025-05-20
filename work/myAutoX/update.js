// 更新逻辑
// 用定时事件触发，暂定为每天触发1次
// 获取云端版本号，与本地版本号对比，如果不同则执行更新task文件
// 否则跳过
// 


const FileTool = require("./lib/模块_文件操作.js");
const DeviceTool = require("./lib/模块_设备操作.js");
// 如果是息屏/休眠状态，需要解锁屏幕
// 先保存亮度，并手动设置亮度

DeviceTool.wakeUpDevice();

toastLog("检查更新中");
// 下载更新js
// 先去寻找云端的版本json
// 对比本地的版本
// 如果一致，就跳过此次更新
// 既然每次都会去请求config.json，那和md5一样，无需记录md5值
// 有个问题，cloudflare不适用高频次的请求，
// 所以只在需要获取config.json的时候使用自己的域名，而
// 获取到config.json，就知道去哪个反代网站获取下载链接了
// 并且config.json可以由我更新
var localCfg = FileTool.getLocalConfig();
var cloudCfg = FileTool.tryDLCloudConfig();
// 如果没有找到云端配置文件，就放弃更新操作，
// 可能是没有网
// 注册销毁，释放引擎
// 需要线程阻塞，让其不要退出
var isNeedLock = true;
// 防止报错不执行
events.on("exit", function () {
    log("update已退出");
    // 锁屏恢复
    if(isNeedLock){
        DeviceTool.cancelWakeUpAndLock();
    }
});


if(!cloudCfg) {
    toastLog("未获取到更新配置，请检查网络情况");
    exit();//相当于return，不能直接用return
}
var localVersion = localCfg["version"];
var newVersion = cloudCfg["version"];
toastLog("本地版本:"+localVersion);
toastLog("云端版本:"+newVersion);
if(newVersion == localVersion){
    toastLog("已经是最新版本！");
}else{
    isNeedLock = false; // 如果要执行别的脚本，就不锁屏
    toastLog("检测到新版本，正在执行更新");
    var dirPath = "tasker/按需更新文件.js";
    var isSucc = FileTool.downloadFile(dirPath);
    // log("下载按需更新文件："+isSucc);
    engines.execScriptFile(dirPath);
    // 覆盖版本
   FileTool.syncConfigFile();
}
