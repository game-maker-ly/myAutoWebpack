// 打开影视仓
exports.openYSC = function (videoName, selectVideoSrc) {
    // launch("com.mygithub0.tvbox0.osdX");
    // 即使打开也是回到桌面，便于无障碍操作
    app.startActivity({
        action: "VIEW",
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
}