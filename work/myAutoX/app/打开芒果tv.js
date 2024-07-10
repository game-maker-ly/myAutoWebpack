const myFloaty = require("../lib/模块_悬浮窗扩展.js");


function _openVideoById(videoId) {
    var videoUrl = util.format("imgotv://player?videoId=%s", videoId);
    log(videoUrl);
    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });
}
// 目前是通过vieeoId来实现跳转的
// 问题就在于获取上一个和下一个的videoId，比模拟操作要靠谱
// 毕竟控件挺麻烦的
function _openMGTV(videoId) {
    _openVideoById(videoId);

    // 全屏
    // 芒果tv无法生效，在高版本miui上
    // 其他强制横屏app也是一样
    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, false);
    if (device.model == "MI 9") {
        log("小米9");
        sleep(7000);
        // 纯坐标是对应不上的
        click(600, 400);// 全屏按钮
        id("toFullScreen").findOne(1000).click();
    } else {
        // 使用waitFor？
        sleep(7000);
        // 纯坐标是对应不上的
        // var btn = id("toFullScreen").findOne();
        click(600, 400);// 全屏按钮
        text("全屏").findOne(1000).click();
    }

    myFloaty.registerRotateBroadcast((type) => {
        myFloaty.notiWithAppExecFinished(false);
        log("当前屏幕方向状态：" + type);
        if (type == myFloaty.ORI_TYPE.Portrait_reverse) {
            log("触发选集事件");
            // 调出选集界面
            try {
                click(300, 300);
                text("选集").findOne(1000).click();
            } catch (error) {}
        }
        myFloaty.notiWithAppExecFinished(true);
    });

    // 需要注意的是
    // 可能是版本问题，或者安卓底层调度问题
    // timer并不总是准确的
    // 会出现过快和过慢的情况，
    // 能用回调+线程阻塞达到同步的方法
    // 或者自带的waitFor方法
    // 就尽量避免用sleep();



    // 这里用横屏来实现全屏，因为芒果tv的视频基本都是横屏
    // 不用去找随时可能改名的按钮
    // 原理就是在最上层构建一个透明的view
    // 然后对这个view进行旋转来达到全屏的目的
}


function _registerSwipe(callback_Func) {
    myFloaty.registerSwipeBroadcast((type) => {
        callback_Func && callback_Func();

    });
}


exports.registerSwipe = function (callback_Func) {
    _registerSwipe(callback_Func);
}

exports.openVideoById = function (videoId) {
    _openVideoById(videoId);
}

exports.openMGTV = function (videoId) {
    _openMGTV(videoId);
}