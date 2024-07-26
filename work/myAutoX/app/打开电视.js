const myFloaty = require("../lib/模块_悬浮窗扩展.js");

exports.openMyTv = function () {
    app.startActivity({
        action: "VIEW",
        packageName: "com.player.diyp2020",
        className: "com.hulytu.diypi.ui.SplashActivity"
    });
    // 全屏
    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, true);
    // 创建两侧按钮
    myFloaty.create2sidesBtn2click(false, () => {
        log("上一频道");
        swipe(1500, 700, 1500, 100, 500);// 上一频道
    }, () => {
        log("下一频道");
        swipe(1500, 100, 1500, 700, 500); //下一频道
    });
}