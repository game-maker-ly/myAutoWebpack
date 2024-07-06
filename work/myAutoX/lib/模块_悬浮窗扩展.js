// 此模块通过创建透明悬浮窗，来实现强制横屏和隐藏导航栏的目的
importClass(android.view.View);

// 用回调不太美观，还是用事件通知吧，结合参数
// 替换updateFloaty

// 悬浮窗对象
var w;
// ori=-1，为自动横屏，=0，横屏，=1，竖屏
function _createFloaty2FullScreen(ori, isHideBar) {
    w = floaty.rawWindow(
        <frame gravity="center">
        </frame>
    );
    //w.setPosition(500, 500);
    // 不能用监听事件代替
    setTimeout(() => {
        w.close();
    }, 5 * 3600 * 1000);
    // 更新悬浮窗
    _updateFloaty(ori, isHideBar);
    // 监听设备旋转
    // _watchFloatyRotate();
}

// ori的参数，-1：自动，0：横屏，1：竖屏，8：横屏反转，9：竖屏反转（无效，应该是miui本身的限制
function _oriType2ori(angle) {
    var ori = -1;
    if (angle == 0) {
        ori = 1;
    } else if (angle == 90) {
        ori = 8;
    } else if (angle == 180) {
        ori = 9;
    } else if (angle == 270) {
        ori = 0;
    }
    return ori;
}

// 监听屏幕方向
// 通过事件来调用updateFloaty，更灵活
// 适用于抖音那种横屏不能正确显示的情况
// 只需要注册一次，
var isWatchInit = false;
var currentType = 0;
function _watchFloatyRotate() {
    var mOrientationEventListener = new JavaAdapter(android.view.OrientationEventListener, {
        onOrientationChanged: (orientation) => {
            //log(orientation);
            var desOriType = -1;
            if (orientation > 340 || orientation < 20) {
                //0
                // 说明是正向
                desOriType = 0;
            } else if (orientation > 71 && orientation < 109) {
                //90
                desOriType = 90;
            } else if (orientation > 161 && orientation < 199) {
                //180
                desOriType = 180;
            } else if (orientation > 251 && orientation < 289) {
                //270
                desOriType = 270;
            }

            if(desOriType != -1){
                if (currentType == desOriType) {
                    // 说明方向没有变化
                    return;
                }
                // 获取当前实际角度
                // var angle = _getScreenRotation();
                // log(angle);
                // 完成修正
                log(desOriType);
                _updateFloatyOri_sync(desOriType);
                // 设置当前屏幕方向状态
                currentType = desOriType;
            }
            // log(getScreenRotation());
        }
    }, context);
    // 启用
    mOrientationEventListener.enable();

    // 需要手动注销，脚本结束时不会自动退出
    events.on("exit", function () {
        log("销毁悬浮窗相关事件");
        mOrientationEventListener.disable();
    });
    isWatchInit = true;
}




// 更新悬浮窗
function _updateFloaty(ori, isHideBar, callback_Func) {
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

        callback_Func && callback_Func();
    });

}

// 使用锁更新悬浮窗角度
var isLocked = false;
// 可以在这里写事件？
// 写个广播
// 适用于广播中不断触发的情形，保证单次只有一个执行
function _updateFloatyOri_sync(oriType, isHideBar = false) {
    if (!isLocked) {
        isLocked = true;
        var ori = _oriType2ori(oriType);
        log("旋转屏幕："+oriType+"度，模式："+ori);
        _updateFloaty(ori, isHideBar, () => {
            events.broadcast.emit("onMyDeviceRotate", oriType);
            isLocked = false;
        });
    }
}


// 不行，回调的目的是为了检测是否需要按下全屏按钮
// 手动横屏→检测页面上是否有全屏按钮，如果有就按下
// 

// 广播+回调的模式
function _registerRotateBroadcast(callback_Func){
    if(!isWatchInit){
        _watchFloatyRotate();
    }
    events.broadcast.on("onMyDeviceRotate", function (type) {
        log("当前屏幕角度："+type);
        var ori = _oriType2ori(type);
        callback_Func && callback_Func(ori);
    });
}

exports.registerRotateBroadcast = function(callback_Func){
    _registerRotateBroadcast(callback_Func);
}

exports.updateFloatyOri_sync = function(callback_Func){
    _updateFloatyOri_sync(callback_Func);
}


exports.createFloaty2FullScreen = function(ori, isHideBar){
    _createFloaty2FullScreen(ori, isHideBar);
}