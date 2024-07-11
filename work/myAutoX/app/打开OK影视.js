const myFloaty = require("../lib/模块_悬浮窗扩展.js");

// 打开fongmi
function _openFongMi(videoName, selectVideoSrc, selectResSrc) {
    // action = MAIN，强制回到主页
    app.startActivity({
        action: "MAIN",
        flags:["ACTIVITY_CLEAR_TOP"],    //清除活动，返回主页
        packageName: "com.fongmi.android.tv",
        className: "com.fongmi.android.tv.ui.activity.HomeActivity"
    });

    // 延时用waitFor/findOnt(timeout)代替

    var sendButton = text("搜索").findOne().parent();
    sendButton.click();
    var searchInput = textContains("关键字").findOne();
    searchInput.setText(videoName);

    // 双击搜索按钮
    sendButton = id("icon").clickable(true).indexInParent(4).findOne();
    sendButton.click();

    if (selectVideoSrc) {
        // 选择播放源
        var selectVideoSrcBtn = textContains(selectVideoSrc).clickable(true).findOne();
        selectVideoSrcBtn.click();
    }

    // 选择第一个
    var firstItem = className("RelativeLayout").visibleToUser(true).clickable(true).indexInParent(0).filter(function (w) {
        return w.bounds().top < 300;
    }).findOne();
    firstItem.click();

    // 选择线路
    if (selectResSrc) {
        textContains(selectResSrc).clickable(true).findOne().click();
    }

    // 全屏
    id("video").clickable(true).findOne().click();
}

function _registerRotateBroadcast4FongMi() {
    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, false);
    // 选集事件
    myFloaty.registerRotateBroadcast((type) => {
        myFloaty.notiWithAppExecFinished(false);
        log("当前屏幕方向状态：" + type);
        if (type == myFloaty.ORI_TYPE.Portrait_reverse) {
            log("触发选集事件");
            // 调出选集界面
            try {
                click(300, 300);
                text("选集").findOne(1000).click();
            } catch (error) { }
        }
        myFloaty.notiWithAppExecFinished(true);
    });
}



// 打开fongmi
exports.openFongMi = function (videoName, selectVideoSrc, selectResSrc) {
    // 打开fongMi
    _openFongMi(videoName, selectVideoSrc, selectResSrc);
}


exports.registerRotateBroadcast4FongMi = function(){
    // 注册选集事件
    _registerRotateBroadcast4FongMi();
}