const myFloaty = require("../lib/模块_悬浮窗扩展.js");


function _openVideoById(videoId) {
    var videoUrl = util.format("imgotv://player?videoId=%s", videoId);
    // log(videoUrl);
    app.startActivity({
        action: "VIEW",
        flags: ["ACTIVITY_CLEAR_TOP", "ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"],   //清除活动，返回主页，对芒果TV无效
        //type: "text/plain",
        data: videoUrl
    });
}
// 目前是通过vieeoId来实现跳转的
// 问题就在于获取上一个和下一个的videoId，比模拟操作要靠谱
// 毕竟控件挺麻烦的
function _openMGTV(videoId) {
    _openVideoById(videoId);

    // 必须在屏幕旋转前创建，不然平板上会无法显示
    myFloaty.create2sidesBtn2click(true, false, () => {
        log("上一集");
        // 抛给上层
        events.broadcast.emit("onMyMgtvChangeNO", true);
    }, () => {
        log("下一集");
        events.broadcast.emit("onMyMgtvChangeNO", false);
    });

    // 全屏
    // 芒果tv无法生效，在高版本miui上
    // 其他强制横屏app也是一样
   
    // sleep不准确
    // sleep(7000);
    // 标志视频加载完成
    text("简介").waitFor();
    // 纯坐标是对应不上的
    click(600, 400);// 全屏按钮
    try {
        if (device.model == "MI 9") {
            log("小米9");
            id("toFullScreen").findOne(1000).click();
        } else {
            text("全屏").findOne(1000).click();
        }
    } catch (error) { }

    // 用sleep函数貌似会出现按钮不显示
    // 等待进入横屏再创建，不然会出现按钮位置不对
    /*
    setTimeout(()=>{
        myFloaty.createBtn2click(false ,()=> {
            // 选集事件
            log("触发选集事件");
            try {
                // 强制无异常
                click(800, 500);
                text("选集").findOne(1000).click();
            } catch (error) {}
        });
    }, 2000);*/
    // 选集事件就不用监听屏幕旋转的方式，不友好
    // 但是刷新悬浮窗位置又需要监听，挺难搞的
    //myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, false);
    //myFloaty.registerRotateBroadcast();
    
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


exports.openVideoById = function (videoId) {
    _openVideoById(videoId);
}

exports.openMGTV = function (videoId) {
    _openMGTV(videoId);
}