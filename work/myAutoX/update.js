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
var cfg_path = "config.json";
var cfg_path_cloud = "config_cloud.json";
var localVersion = FileTool.getLocalVersion();
var cloudCfg = FileTool.downloadFileAndRead(cfg_path, cfg_path_cloud);
// 如果没有找到云端配置文件，就放弃更新操作，
// 可能是没有网
if(cloudCfg == null) {
    toastLog("未获取到更新配置，请检查网络情况");
    DeviceTool.cancelWakeUpAndLock();
    exit();//相当于return，不能直接用return
}
var newVersion = cloudCfg["version"];
toastLog("本地版本:"+localVersion);
toastLog("云端版本:"+newVersion);
if(newVersion == localVersion){
    toastLog("已经是最新版本！");
    DeviceTool.cancelWakeUpAndLock();
}else{
    toastLog("检测到新版本，正在执行更新");
    var dirPath = "tasker/按需更新文件.js";
    FileTool.downloadFile(dirPath);
    engines.execScriptFile(dirPath);
    // 覆盖版本
    files.remove(cfg_path);
    files.rename(cfg_path_cloud, cfg_path);
}
