// 此模块通过创建透明悬浮窗，来实现强制横屏和隐藏导航栏的目的
importClass(android.view.View);

_createFloaty2FullScreen(0, true);

// ori=-1，为自动横屏，=0，横屏，=1，竖屏
function _createFloaty2FullScreen(ori, isHideBar) {
    var w = floaty.rawWindow(
        <frame gravity="center">
        </frame>
    );

    //w.setPosition(500, 500);

    setTimeout(() => {
        w.close();
    }, 5*3600*1000);

    // 反射获取悬浮窗实例
    var b = w.getClass().getDeclaredField("mWindow");
    b.setAccessible(true);
    //b.set(w, true)
    var c = b.get(w);

    const LayoutParams = android.view.WindowManager.LayoutParams;
    var windowManager = c.getWindowManager();
    var layoutParams = c.getWindowLayoutParams();
    var wview = c.getWindowView();

    ui.run(function () {
        // 屏幕方向
        layoutParams.screenOrientation = ori;
        // 隐藏导航栏
        if (isHideBar) {
            wview.setSystemUiVisibility(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN);
            layoutParams.flags = LayoutParams.FLAG_LAYOUT_NO_LIMITS | layoutParams.flag;
        }
        // 去除遮挡
        w.setTouchable(false);
        // 更新布局
        c.updateWindowLayoutParams(layoutParams);
    });

}
/*
exports.createFloaty2FullScreen = function(ori, isHideBar){
    _createFloaty2FullScreen(ori, isHideBar);
}*/