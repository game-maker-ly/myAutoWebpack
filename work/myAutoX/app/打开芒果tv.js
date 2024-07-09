const myFloaty = require("../lib/模块_悬浮窗扩展.js");

exports.openMGTV = function (videoId) {
    var videoUrl = util.format("imgotv://player?videoId=%s", videoId);
    log(videoUrl);
    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });

    // 全屏
    // 芒果tv无法生效，在高版本miui上
    // 其他强制横屏app也是一样
    if (device.model == "MI 9") {
        myFloaty.createFloaty2FullScreen(0, true);

        myFloaty.registerSwipeBroadcast((type)=> {
            if(type == "UP"){
                log("向上滑");
            }else if(type == "DOWN"){
                log("向下滑");
            }
        });
    } else {
        // 使用waitFor？
        sleep(7000);
        // 纯坐标是对应不上的
        // var btn = id("toFullScreen").findOne();
        click(600, 400);// 全屏按钮
        sleep(1000);
        text("全屏").findOnce().click();
    }

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

