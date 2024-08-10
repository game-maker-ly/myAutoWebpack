const myFloaty = require("../lib/模块_悬浮窗扩展.js");

exports.openMyTv = function () {
    // 创建两侧按钮，延时3s创建，不然位置不对
    // sleep(3000);
    myFloaty.create2sidesBtn2click(true, false, () => {
        log("上一频道");
        // 其实是写反了，不过app自己有换台反转，那就先这样吧
        // 这个动作是上滑，抖音的上滑是查看下一视频
        // 电视默认上滑是下一个台，很合理
        // 反转后就是上一个台
        swipe(1500, 700, 1500, 100, 500);// 上一频道
    }, () => {
        log("下一频道");
        swipe(1500, 100, 1500, 700, 500); //下一频道
    });

    app.startActivity({
        action: "VIEW",
        packageName: "com.player.diyp2020",
        className: "com.hulytu.diypi.ui.SplashActivity"
    });
    // 全屏
    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, true);
}
