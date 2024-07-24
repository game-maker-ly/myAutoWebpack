const myFloaty = require("../lib/模块_悬浮窗扩展.js");

var isInit = false;
// 重复打开activity，会触发抖音的活动销毁，强制回到主页
// 需要每隔几次，就清空前面的活动
var reOpenCount = 0;
function searchWithType_private(keyword, type) {
    var clearFlags = [];
    if(reOpenCount < 5){
        clearFlags = [];
        reOpenCount++;
    }else{
        // 利用flag清除之前的活动
        clearFlags = ["ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"];
        reOpenCount = 0;
    }
    var videoUrl = util.format("snssdk1128://search?keyword=%s", keyword);
    app.startActivity({
        action: "VIEW",
        flags: clearFlags,    //清除上次活动，每隔5次清空，观感好不少
        data: videoUrl
    });
    // 强制竖屏
    if (!isInit) {
        log("创建悬浮窗");
        myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Portrait, false);
    }
}


function _openHome(type) {
    var videoUrl = "snssdk1128://feed";
    app.startActivity({
        action: "VIEW",
        data: videoUrl
    });
    // 选择页面
    // 默认是精选页面
    // 仅考虑长辈模式下，只有同城，关注，精选
    if (type) {
        textContains("@").waitFor();
        text(type).visibleToUser().findOne().parent().click();
    }
    if(!isInit){
        // 仅自动全屏，不用选集按钮
        myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Portrait, false);
        addMyRotateEvent();
        isInit = true;
    }
}

exports.searchWithType = function (keyword, type, isNewest = true) {
    log(keyword + "," + isNewest);
    searchWithType_private(keyword, type);
    // 等6s后操作
    // sleep(3000);
    text("视频").findOne().parent().click();
    // click(bb.centerX(), bb.centerY());
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
    if (isNewest) {
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
    // 广播注册与事件调用分开？
    if (!isInit) {
        log("注册旋转广播");
        // 注册旋转广播
        // 这里用悬浮窗按钮代替旋转事件监听
        addMyRotateEvent();
        myFloaty.createBtn2click(false, () => {
            // 隐藏按钮
            log("隐藏按钮");
            myFloaty.setBtnVisibility(false);
            events.broadcast.emit("DY_RE_search");
            // 需要重置回竖屏，做完操作后再切回来
        });
    }
    // 显示按钮
    myFloaty.setBtnVisibility(true);
    // 通知悬浮窗，app操作执行完毕，释放广播锁
    myFloaty.notiWithAppExecFinished(true);
    // 初始化完成
    isInit = true;
}

// 自动旋转全屏
function addMyRotateEvent() {
    myFloaty.registerRotateBroadcast((type) => {
        log("当前屏幕方向状态：" + type);
        /*
        if (type == myFloaty.ORI_TYPE.Portrait_reverse) {
            log("触发重选关键词事件");
            // 广播给上层处理，或者回调
            events.broadcast.emit("DY_RE_search");
        }*/
        // 手动更新布局
        var isIngored = (type == myFloaty.ORI_TYPE.Portrait_reverse || type == myFloaty.ORI_TYPE.Auto);
        // 如果需要旋转，就旋转
        if (!isIngored) {
            myFloaty.updateFloaty(type, false, () => {
                log("旋转屏幕至：" + type + "度");
                // log("当前屏幕角度："+oriType);
                var isLandscape = (type == myFloaty.ORI_TYPE.Landscape | type == myFloaty.ORI_TYPE.Landscape_reverse);
                // 如果是横屏，就检测全屏按钮
                // 否则就返回上一级
                // 这里findOne会有1s延迟，
                log("是否横屏：" + isLandscape);
                if (isLandscape) {
                    try {
                        // 横屏隐藏悬浮窗按钮
                        myFloaty.setBtnVisibility(false);
                        // 获取全屏按钮
                        // 点击坐标，会出现动画未完成，但回调已触发的情况，获取到的bounds不准
                        var b1 = textContains("全屏").visibleToUser(true).findOne(1000).parent();
                        if (b1 != null) {
                            log("检测到横屏视频，已自动全屏");
                            b1.click();
                        }
                    } catch (error) { }
                } else {
                    // 竖屏恢复悬浮窗按钮
                    myFloaty.setBtnVisibility(true);
                    // 竖屏，且没有导航栏，则返回
                    // 有几种情况，
                    // 1.已全屏，需要返回
                    // 2.未全屏竖屏，
                    var s_btn = textContains("@").findOne(1000);
                    if (s_btn == null) {
                        // 说明不正常，进入了竖屏全屏，手动返回
                        back();
                    }
                }
            });
        }else{
            // 不旋转也要释放锁
            myFloaty.notiWithAppExecFinished(true);
        }
    });
}


// 比较特殊的，点进去就是视频，不过还是注册一下屏幕旋转？
// 倒是不需要选集按钮
exports.openHome = function (type) {
    _openHome(type);
}
