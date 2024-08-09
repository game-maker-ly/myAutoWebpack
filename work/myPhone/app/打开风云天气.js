const adbTool = require("../lib/root/模块_adb命令.js");

// 使用意图打开
// 使用adb关闭
exports.open = function(){
    app.startActivity({
        action: "VIEW",
        packageName: "me.wsj.fengyun",
        className: "me.wsj.fengyun.ui.activity.SplashActivity"
    });
}

exports.close = function(){
    adbTool.forceStopApp("me.wsj.fengyun");
}

