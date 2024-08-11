const myFloaty = require("../lib/模块_悬浮窗扩展.js");

// 国际版意图跳转，无更新提示和广告，更流畅
function _openVideoById(videoId) {
    // 国际版是omgotv
    var videoUrl = util.format("omgotv://player?videoId=%s", videoId);
    app.startActivity({
        action: "VIEW",
        flags: ["ACTIVITY_CLEAR_TOP", "ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"],   //清除活动，返回主页，对芒果TV无效
        data: videoUrl
    });
}
// 目前是通过vieeoId来实现跳转的
// 问题就在于获取上一个和下一个的videoId，比模拟操作要靠谱
// 毕竟控件挺麻烦的
function _openMGTV(videoId) {
    // 必须在屏幕旋转前创建，不然平板上会无法显示
    myFloaty.create2sidesBtn2click(true, false, () => {
        log("上一集");
        // 抛给上层
        events.broadcast.emit("onMyMgtvChangeNO", true);
    }, () => {
        log("下一集");
        events.broadcast.emit("onMyMgtvChangeNO", false);
    });

    sleep(1000);
    _openVideoById(videoId);

    // 全屏横屏
    // 芒果tv无法生效，在高版本miui上
    // 其他强制横屏app也是一样
   
    // sleep不准确
    // sleep(7000);
    // 标志视频加载完成
    id("main_title").waitFor();
    // 纯坐标是对应不上的
    click(600, 400);// 全屏按钮
    // 延时1s再点
    try {
        id("iv_player_full_screen_portrait").findOne(3000).click();
    } catch (error) { }
}


exports.openVideoById = function (videoId) {
    _openVideoById(videoId);
}

exports.openMGTV = function (videoId) {
    _openMGTV(videoId);
}