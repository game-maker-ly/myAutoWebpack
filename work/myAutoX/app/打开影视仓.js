const myFloaty = require("../lib/模块_悬浮窗扩展.js");

// 打开影视仓
exports.openYSC = function (videoName, selectVideoSrc) {
    // launch("com.mygithub0.tvbox0.osdX");
    // 即使打开也是回到桌面，便于无障碍操作
    // action = MAIN，强制回到主页
    app.startActivity({
        action: "MAIN",
        flags:["ACTIVITY_CLEAR_TOP"],    //清除活动，返回主页
        packageName: "com.mygithub0.tvbox0.osdX",
        className: "com.github.tvbox.osc.ui.activity.HomeActivity"
    });

    // 基本上是做不到切换源了
    // 找不到当前播放的集数
    

    var sendButton = text("搜索").findOne();
    sendButton.click();

    var searchInput = text("请输入要搜索的内容").findOne();
    searchInput.setText(videoName);

    sendButton = text("搜索").findOne();
    sendButton.click();

    sleep(2000);

    var selectVideoSrcBtn = textContains(selectVideoSrc).clickable(true).findOne();
    selectVideoSrcBtn.click();

    //textContains(videoName).depth(12).findOne().parent().parent().click();

    sleep(2000);
    click(450, 450);
    // className("android.view.View").depth(10).findOne().parent().parent().parent().click();
    sleep(7000);
    //var widget=className("android.view.View").findOne();
    click(100, 100);
    //如果用root权限则用Tap

    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, false);
    // 选集事件
    myFloaty.registerRotateBroadcast((type) => {
        myFloaty.notiWithAppExecFinished(false);
        log("当前屏幕方向状态：" + type);
        if (type == myFloaty.ORI_TYPE.Portrait_reverse) {
            log("触发选集事件");
            // 调出选集界面
            try {
                click(800, 500);
                text("选集").findOne(1000).click();
            } catch (error) {}
        }
        myFloaty.notiWithAppExecFinished(true);
    });
}
