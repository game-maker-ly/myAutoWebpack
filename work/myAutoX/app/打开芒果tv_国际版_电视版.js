const myFloaty = require("../lib/模块_悬浮窗扩展.js");

var isFirst = true;
// 芒果tv电视版，懒得转屏幕和找全屏控件了，直接用横屏的
function _openVideoById(videoId) {
    // 需要销毁活动，否则partId不生效，或者结合clipId也是一样的效果
    // 这里partId就相当于videoId，还有个PlId，播放列表id
    var videoUrl = util.format("mgtvapp://vod/player?partId=%s", videoId);
    app.startActivity({
        action: "VIEW",
        flags: ["ACTIVITY_CLEAR_TOP", "ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"],   //清除活动，返回主页，对芒果TV无效
        data: videoUrl
    });
    
    if(isFirst){
        // 第一次进入等待指定控件出现再点击
        text("全屏").waitFor();
        isFirst = false;
        sleep(2000);
    }
    // 全屏
    sleep(1000);
    click(1200, 610);
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
    // 延时1s启动，否则悬浮窗有概率无法正确显示
    sleep(1000);
    _openVideoById(videoId);

    // 用悬浮窗隐藏导航栏设置全屏
    // 需要注意的是，用此悬浮窗后会导致控件查找失效
    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, true);
}

exports.openVideoById = function (videoId) {
    _openVideoById(videoId);
}

exports.openMGTV = function (videoId) {
    _openMGTV(videoId);
}