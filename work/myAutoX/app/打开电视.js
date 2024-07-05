const myFloaty = require("../lib/模块_悬浮窗扩展.js");

exports.openMyTv = function(){
    app.startActivity({
        action: "VIEW",
        packageName: "com.player.diyp2020",
        className: "com.hulytu.diypi.ui.SplashActivity"
    });
    // 全屏
    myFloaty.createFloaty2FullScreen(0, true);
}