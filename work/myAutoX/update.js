// 更新逻辑
// 用定时事件触发，暂定为每天触发1次
// 获取云端版本号，与本地版本号对比，如果不同则执行更新task文件
// 否则跳过
// 
const FileTool = require("./lib/模块_文件操作.js");
toastLog("检查更新中");
// 下载更新js
// 先去寻找云端的版本json
// 对比本地的版本
// 如果一致，就跳过此次更新
var cfg_path = "config.json";
var cfg_path_cloud = "config_cloud.json";
var newVersion = FileTool.downloadFileAndRead(cfg_path, cfg_path_cloud)["version"];
var localVersion = FileTool.getLocalVersion();
toastLog("本地版本:"+localVersion);
toastLog("云端版本:"+newVersion);
if(newVersion == localVersion){
    toastLog("已经是最新版本！");
}else{
    toastLog("检测到新版本，正在执行更新");
    var dirPath = "tasker/按需更新文件.js";
    FileTool.downloadFile(dirPath);
    engines.execScriptFile(dirPath);
    // 覆盖版本
    files.remove(cfg_path);
    files.rename(cfg_path_cloud, cfg_path);
}
