var curBrightnerss_Mode = 0;
var curBrightnerss = 240;
var isWakeUpState = false;

// 调用无障碍服务的接口实现锁屏动作
// 如果无障碍服务未开启则报错
function lockScreen() {
    var success = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN);
    return success;
}
// 亮度模式
function setDeviceBrightness_Mode(mode) {
    curBrightnerss_Mode = device.getBrightnessMode();
    device.setBrightnessMode(mode);
}

function resetDeviceBrightness_Mode() {
    device.setBrightnessMode(curBrightnerss_Mode);
}
// 亮度
function setDeviceBrightness(b) {
    curBrightnerss = device.getBrightness();
    device.setBrightness(b);
}

function resetDeviceBrightness() {
    device.setBrightness(curBrightnerss);
}

// 设置亮度 唤醒设备，
exports.wakeUpDevice = function () {
    // 假如是任务触发的，那么intent不为空
    // 说明isNotTask的值为false
    // 此时执行唤醒设备的代码
    var isNotTask = !engines.myEngine().execArgv.intent;
    if (!isNotTask) {
        isWakeUpState = true;
        var lowBrightnerss = 1;
        // 设置手动亮度模式
        setDeviceBrightness_Mode(0);
        setDeviceBrightness(lowBrightnerss);
        device.wakeUp();
        device.keepScreenOn(300 * 1000);
        sleep(1000);    // 等待
        // 小米默认锁屏无法用匀速手势打开
        // 只能换主题
        // 或者用下拉通知栏的方式，点击时钟解锁
        // 检测是否有数字锁屏
        // 假如是小米9，就不执行滑动
        // 用下拉通知栏唤起时钟代替
        var deviceName = device.model;
        if(deviceName == "MI 9"){
            //下拉状态栏
            swipe(500, 30, 500, 1000, 300);
            sleep(400);
            //点击时间
            click(100, 120);
            // 
            sleep(700);
            desc(2).findOne().click();
            desc(2).findOne().click();
            desc(3).findOne().click();
            desc(3).findOne().click();
        }else{
            swipe(500, 1800, 500, 0, 500);
        }
    }
}
// 恢复亮度，并锁屏
exports.cancelWakeUpAndLock = function () {
    var isNotTask = !engines.myEngine().execArgv.intent;
    // 防止重复触发
    if (!isNotTask && isWakeUpState) {
        isWakeUpState = false;
        device.cancelKeepingAwake();
        lockScreen();
        resetDeviceBrightness_Mode();
        resetDeviceBrightness();
    }
}


function goHome() {
    app.startActivity({
        action: "MAIN",
        category: "android.intent.category.HOME",
        flags: ["activity_clear_top"]
    });
}

exports.goHome = function(){
    goHome();
}