const myFloaty = require("../lib/模块_悬浮窗扩展.js");

function searchWithType_private(keyword, type) {
    var videoUrl = util.format("snssdk1128://search?keyword=%s", keyword);
    app.startActivity({
        action: "VIEW",
        data: videoUrl
    });
    // 强制竖屏
    myFloaty.createFloaty2FullScreen(1, false);
}


exports.searchWithType = function (keyword, type, isNewest = true) {
    searchWithType_private(keyword, type);
    // 等6s后操作
    sleep(3000);
    var bb = text("视频").findOnce().bounds();
    click(bb.centerX(), bb.centerY());
    sleep(3000);
    // 按最新排序
    // 实际上得根据不同设备来录
    // 就比如平板DPI和手机不同
    // 控件的坐标自然不同
    // 最理想的办法是定位到所需控件的坐标（哪怕是相对坐标也好
    // 次一点的做法就是看这个控件在整个屏幕里离边框的百分比
    // 然后就是这种写死坐标的方式
    // setScreenMetrics(1080, 2340);
    // 可以按最新排序
    if(isNewest){
        // 筛选
        click(1150, 250);// 得根据不同分辨率适配位置
        sleep(700);
        // 最新发布
        click(500, 500);
        sleep(700);
        // 返回
        click(500, 1600);
        sleep(3000);
    }
    // 打开视频
    click(300, 500);
    // 然后尝试跟随屏幕旋转
    // 问题在于竖屏需要触发返回按钮
    myFloaty.registerRotateBroadcast((type)=> {
        var b1 = null;
        log("当前屏幕方向状态："+type);
        var isLandscape = (type == 0 | type == 8);
        // 如果是横屏，就检测全屏按钮
        // 否则就返回上一级
        if(isLandscape){
            try {
                b1 = textContains("全屏").visibleToUser(true).findOnce().bounds();
            } catch (error) {}
            if(b1 != null){
                log("检测到横屏视频，已自动全屏");
                click(b1.centerX(), b1.centerY());
            }
        }else{
            // 竖屏，且没有导航栏，则返回
            // 有几种情况，
            // 1.已全屏，需要返回
            // 2.未全屏竖屏，
            var s_btn = textContains("@").findOnce();
            if(s_btn == null){
                // 说明不正常，进入了竖屏全屏，手动返回
                back();
            }
        }
        
    });
}

