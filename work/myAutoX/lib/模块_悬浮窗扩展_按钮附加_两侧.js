const MyFloatyBtn = require("./class/类_悬浮窗按钮.js").MyFloatyBtn;

// 宏声明按钮大小
// 按钮大小考虑调整
// 透明度考虑降低以不影响观看
const BTN_SIZE = 70;
var DEVICE_W = 1200;
var DEVICE_H = 2000;
if(device.model == "MI 9"){
    DEVICE_W = device.width;
    DEVICE_H = device.height;
}

// 只读一次设备尺寸，防止因屏幕旋转造成读取错误
// 但是如果屏幕本来就是横屏就会出错
// 这个参数是建立在竖屏的
// 高版本安卓，device.width为0，为autojs本身的bug
// 还有一个谜之bug，有概率在打开应用时报错
// 不在ui线程创建view，奇怪
// 其他调用没有这个问题
// 就这里难道是创建了2个悬浮窗所以会出现这个问题？
// 后面尝试摸清触发条件，复现bug，再修复
// 另外打开应用时，再创建按钮会不显示，还是一个显示一个不显示
// 这就很离谱了
// 难不成硬要加个ui.run？
// 平板屏幕布局变化时/旋转时，此时创建悬浮窗有概率无法显示
// 目前要么提前创建，要么延后创建

var window;
var window_r;
function _create2sidesBtn2clickAddon(isLandscape, isDragable, callback_Func, callback_Func_R) {
    // 还是相对路径，需要注意，由于基本是快捷方式调用，所以会导致找不到图标
    window = new MyFloatyBtn(1, "file://../icon/上一集.png", BTN_SIZE);
    window_r = new MyFloatyBtn(2, "file://../icon/下一集.png", BTN_SIZE);

    // 根据屏幕朝向，修改按钮坐标
    // var angle = _getScreenRotation();
    // var isLandscape = angle == 1 || angle == 3;
    // 把修改朝向抛给上层处理，主要电视这个挺迷的，打开电视后创建悬浮窗不会显示
    // 只能打开之前创建
    _setBtnPos(isLandscape);

    // 注册点击广播
    _registerClickBroadcast(isDragable, callback_Func, callback_Func_R);

}


var cacheWindowManager = null;
// 0,1,2,3，分别是竖屏，横屏，反转竖屏，反转横屏
function _getScreenRotation() {
    if (cacheWindowManager == null) {
        cacheWindowManager = context.getSystemService(context.WINDOW_SERVICE);
    }
    return cacheWindowManager.defaultDisplay.rotation;
}


function _registerClickBroadcast(isDragable, callback_Func, callback_Func_R) {
    // 可拖拽改变位置
    if(!window) return;
    // 回调注册事件
    window.setOnClickListener(isDragable, callback_Func);
    window_r.setOnClickListener(isDragable, callback_Func_R);
}


// 理论上用面向对象的方式更好重构
// 但现在先跑起来再说
function _setBtnPos(isLandscape) {
    if (!window) return;
    // 根据屏幕方向变化
    
    // 直接根据型号固定分辨率吧，用context获取的不准
    // log("坐标"+DEVICE_W+":"+DEVICE_H);
    if (isLandscape) {
        window.setPos(0, DEVICE_W / 2 - BTN_SIZE - 200);
        window_r.setPos(DEVICE_H - BTN_SIZE * 3, DEVICE_W / 2 - BTN_SIZE - 200);
    } else {
        window.setPos(0, DEVICE_H / 2 - BTN_SIZE - 200);
        window_r.setPos(DEVICE_W - BTN_SIZE, DEVICE_H / 2 - BTN_SIZE - 200);
    }
}

var curVisibility = true;
function _setVisibility(isShow) {
    if (!window) return;
    // 这里需要用ui线程更新可视化
    // 如果当前状态和传入状态一致，则不做操作
    window.show(isShow);
    window_r.show(isShow);
    // 否则进行相应操作，并修改当前状态
    curVisibility = isShow;
}



// angle的参数，0：竖屏，1：横屏，3：横屏反转，2：竖屏反转
// 
function _angle2oriType(angle) {
    var ori = -1;
    if (angle == 0) {
        ori = 0;
    } else if (angle == 1) {
        ori = 270;
    } else if (angle == 2) {
        ori = 180;
    } else if (angle == 3) {
        ori = 90;
    }
    return ori;
}

// 问题在于怎么兼容，这么多东西写在一个脚本里很容易弄混
// 要不新建一个得了
// 目前只有创建按钮，刷新位置和设置点击事件需要暴露出去
// 点击事件肯定是创建时就赋值
// 刷新位置交给上层

exports.create2sidesBtn2clickAddon = function (isLandscape, isDragable, callback_Func, callback_Func_R) {
    _create2sidesBtn2clickAddon(isLandscape, isDragable, callback_Func, callback_Func_R);
}


exports.setBtnPos = function (isLandscape) {
    _setBtnPos(isLandscape);
}

exports.setVisibility = function (isShow) {
    _setVisibility(isShow);
}

exports.getCurrentOriTypeAddon = function () {
    var angle = _getScreenRotation();
    return _angle2oriType(angle);
}
