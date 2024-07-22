const AddonTool_Btn = require("./模块_悬浮窗扩展_按钮分支.js");
// 此模块通过创建透明悬浮窗，来实现强制横屏和隐藏导航栏的目的
importClass(android.view.View);

// 用回调不太美观，还是用事件通知吧，结合参数
// 替换updateFloaty
const ORI_TYPE = {
    Auto: -1,
    Portrait:0,
    Portrait_reverse:180,
    Landscape: 270,
    Landscape_reverse: 90,
}
// 枚举
exports.ORI_TYPE = ORI_TYPE;


// 悬浮窗对象
var w;
// ori=-1，为自动横屏，=0，横屏，=1，竖屏
// 像影视仓，芒果app等自带横屏的
// 用悬浮窗横屏覆盖，会导致找不到控件（偶尔，有点离谱
// 抖音就没这个问题，果然app还是大厂兼容性高
function _createFloaty2FullScreen(oriType, isHideBar) {
    w = floaty.rawWindow(
        <frame gravity="center" id="myFloatyView">
        </frame>
    );
    // 设为全屏
    w.setSize(-1, -1);
    // 去除遮挡
    // w.setTouchable(false);

    //w.setPosition(500, 500);
    // 不能用监听事件代替
    setTimeout(() => {
        w.close();
    }, 5 * 3600 * 1000);
    // 更新悬浮窗
    _updateFloaty(oriType, isHideBar);
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
    if(isWatchInit){
        // 说明已存在广播，直接返回
        return;
    }
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
                    // 说明方向没有变化，退出
                    return;
                }
                // 获取当前实际角度
                // var angle = _getScreenRotation();
                // log(angle);
                // 完成修正
                // log(desOriType);
                // 否则执行更新，这里可以用广播或回调把处理旋转的逻辑抛给上层处理
                _emitUpdateFloatyBroadcast(desOriType);
                // 设置当前屏幕方向状态，关键是这个type一定要对
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


// 自定义flag处理函数(位运算)
// 好处就是添加flag不会重复生效
// 同样移除也是
//添加 FLAG：mGroupFlags |= FLAG 
//清除 FLAG：mGroupFlags &= ~FLAG 
//包含 FLAG：(mGroupFlags & FLAG) != 0 或 (mGroupFlags & FLAG) == FLAG 
//不包含 FLAG：(mGroupFlags & FLAG) == 0 或 (mGroupFlags & FLAG) != FLAG
function _addFlag(srcFlags, flag) {
    srcFlags |= flag;
    return srcFlags;
}

function _removeFlag(srcFlags, flag) {
    srcFlags &= ~flag;
    return srcFlags;
}



// 更新悬浮窗
// 使用锁更新悬浮窗角度
var isLocked = false;
function _updateFloaty(oriType, isHideBar, callback_Func) {
    if(isLocked){
        return;
    }
    // 加锁
    isLocked = true;
    // 反射获取悬浮窗实例
    var b = w.getClass().getDeclaredField("mWindow");
    b.setAccessible(true);
    //b.set(w, true)
    var c = b.get(w);

    const LayoutParams = android.view.WindowManager.LayoutParams;
    var windowManager = c.getWindowManager();
    var layoutParams = c.getWindowLayoutParams();
    var wview = c.getWindowView();


    // 必须直接赋值，不知道为什么
    // 原理不明
    // 
    // 屏幕方向
    var ori = _oriType2ori(oriType);
    layoutParams.screenOrientation = ori;
    ui.run(function () {
        // 隐藏导航栏
        if (isHideBar) {
            log("隐藏导航栏");
            // 隐藏导航栏（对view的操作必须在ui线程
            wview.setSystemUiVisibility(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN);
            // 全屏
            layoutParams.flags =  LayoutParams.FLAG_LAYOUT_NO_LIMITS;
            layoutParams.flags |= LayoutParams.FLAG_FULLSCREEN;
        } else {
            log("取消隐藏导航栏");
            // 取消沉浸模式
            wview.setSystemUiVisibility(~View.SYSTEM_UI_FLAG_HIDE_NAVIGATION & ~View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY & ~View.SYSTEM_UI_FLAG_FULLSCREEN);
            // 移除全屏flag
            layoutParams.flags &= (~LayoutParams.FLAG_FULLSCREEN);
            layoutParams.flags = LayoutParams.FLAG_NOT_FOCUSABLE;
        }
        // 去除遮挡
        layoutParams.flags = _addFlag(layoutParams.flags, LayoutParams.FLAG_NOT_TOUCHABLE);
        
        // 更新布局
        c.updateWindowLayoutParams(layoutParams);

        callback_Func && callback_Func();
        isLocked = false;// 释放锁
        isEmitLocked = false;
    });
}

// 与更新悬浮窗共用锁，防止频繁广播
// 不能共用锁？
// 这里的锁只能保证不会重复触发动画
// 还需要一个锁，并且有一个锁住，就不发送广播
var isEmitLocked = false;
function _emitUpdateFloatyBroadcast(oriType){
    // log("当前布局锁："+isLocked+"，当前广播锁："+ isEmitLocked +"，当前屏幕方向："+oriType);
    if(isEmitLocked) return;
    isEmitLocked = true;
    log("测试");
    if(isLocked) return;
    events.broadcast.emit("onMyDeviceRotate", oriType);
}



// 不行，回调的目的是为了检测是否需要按下全屏按钮
// 手动横屏→检测页面上是否有全屏按钮，如果有就按下
// 

// 广播+回调的模式
// 实际上可以只用广播
// events模块是在当前脚本线程里的，如果当前脚本被死循环阻塞，那不会触发
// 那实际上on方法可以提到需要的地方
// 但话又说回来了，是先要注册广播
// 再写广播回调，那实际上也没差，写在这里还方便理解
// 用回调函数抛出，虽然模块之间的关系比较麻烦
// 
function _registerRotateBroadcast(callback_Func){
    // 注册旋转广播
    _watchFloatyRotate();
    // 返回
    events.broadcast.on("onMyDeviceRotate", function (type) {
        // 尝试更新坐标
        AddonTool_Btn.setBtnPos(type == 90 || type == 270);
        callback_Func && callback_Func(type);
    });
    events.broadcast.on("onMyAppExecFinished", function (isFinished) {
        // 锁住/解锁广播
        isEmitLocked = !isFinished;
        log("广播锁变化："+isEmitLocked);
    });
}

function _notiWithAppExecFinished(isFinished){
    events.broadcast.emit("onMyAppExecFinished", isFinished);
}

var minSwipeDistance = 100;
var mPosX = 0;
var mPosY = 0;
var mCurPosX = 0;
var mCurPosY = 0;
function _registerSwipeBroadcast(callback_Func){
    // 目前来说，事件注册只会进行一次
    // 但是update布局会在自动旋转里进行多次
    // 所以touchable必须得用全局变量保存，要么就避免同时用
    // 本身这个就算是hook事件
    w.setTouchable(true);

    var mTouchEventListener = new JavaAdapter(android.view.View.OnTouchListener, {
        onTouch: (view, event) => {
            var act = event.getAction();
            //log(act);
            switch (act) {
                case 0://ACTION_DOWN
                    mPosX = event.getX();
                    mPosY = event.getY();
                    break;
                case 2://ACTION_MOVE
                    mCurPosX = event.getX();
                    mCurPosY = event.getY();
                    break;
                case 1://ACTION_UP
                    // 优化一下也可以监听左右滑动
                    if (mCurPosY - mPosY > minSwipeDistance) {
                        //向下滑動
                        log("向下滑动");
                        events.broadcast.emit("onMyDeviceSwipe", "DOWN");
                    } else if (mCurPosY - mPosY < -minSwipeDistance) {
                        //向上滑动
                        log("向上滑动");
                        events.broadcast.emit("onMyDeviceSwipe", "UP");
                    } else if (mCurPosX - mPosX > minSwipeDistance) {
                        //向右滑動
                        log("向右滑动");
                        events.broadcast.emit("onMyDeviceSwipe", "RIGHT");
                    } else if (mCurPosX - mPosX < -minSwipeDistance) {
                        //向左滑动
                        log("向左滑动");
                        events.broadcast.emit("onMyDeviceSwipe", "LEFT");
                    }
                    break;
            }
            return true;
        }
    });
    // 设置监听
    w.myFloatyView.setOnTouchListener(mTouchEventListener);
    
    events.broadcast.on("onMyDeviceSwipe", function (type) {
        callback_Func && callback_Func(type);
    });
}

exports.notiWithAppExecFinished = function(isFinished){
    _notiWithAppExecFinished(isFinished);
}

exports.registerSwipeBroadcast = function(callback_Func){
    _registerSwipeBroadcast(callback_Func);
}

exports.registerRotateBroadcast = function(callback_Func){
    _registerRotateBroadcast(callback_Func);
}

exports.updateFloaty = function(oriType, isHideBar, callback_Func){
    _updateFloaty(oriType ,isHideBar, callback_Func);
}


exports.createFloaty2FullScreen = function(oriType, isHideBar){
    _createFloaty2FullScreen(oriType, isHideBar);
}

// 创建点击按钮
// 方法名不能重复
exports.createBtn2click= function(isDragable, callback_Func){
    AddonTool_Btn.createBtn2clickAddon(isDragable, callback_Func);
}