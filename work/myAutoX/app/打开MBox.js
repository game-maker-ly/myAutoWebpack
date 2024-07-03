// 打开MBox
exports.openMBox = function (videoName, selectVideoSrc, selectResSrc) {
    // launch("com.mygithub0.tvbox0.osdX");
    // 即使打开也是回到桌面，便于无障碍操作
    app.startActivity({
        action: "VIEW",
        packageName: "com.github.tvbox.osc",
        className: "com.github.tvbox.osc.ui.activity.SplashActivity"
    });

    // 每次都会更新订阅，得等3s以上
    sleep(3000);

    var sendButton = id("search").findOne();
    sendButton.click();

    var searchInput = id("et_search").findOne();
    searchInput.setText(videoName);

    sleep(1000);

    var sendButton = id("iv_search").findOne();
    sendButton.click();

    sleep(2000);

    var selectVideoSrcBtn = textContains(selectVideoSrc).clickable(true).findOne();
    selectVideoSrcBtn.click();

    sleep(2000);
    var selectVideo2play = id("tvName").findOne().bounds();
    click(selectVideo2play.centerX() + 200, selectVideo2play.centerY()+50);


    sleep(2000);
    // 貌似无法规避重复点击
    // 要么申请截图，取色，不过太麻烦了

    // sleep函数限制太大了
    // 不论是自身准确性
    // 还是受网速影响

    var selectResBtn = id("tvFlag").textContains(selectResSrc).findOne().parent();
    selectResBtn.click();

    sleep(1000);
    var selectCurEpisode = id("sl").selected().findOne();
    selectCurEpisode.click();
    // 全屏
    sleep(6000);
    var mainBounds = id("subtitle_view").findOne().bounds();
    click(mainBounds.centerX(), mainBounds.centerY() - 100);
    sleep(1000);
    id("iv_fullscreen").findOne().click();
}