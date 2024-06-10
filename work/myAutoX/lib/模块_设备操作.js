var curBrightnerss_Mode = 0;
var curBrightnerss = 240;

// 调用无障碍服务的接口实现锁屏动作
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
        swipe(500, 1800, 500, 0, 500);
    }
}
// 恢复亮度，并锁屏
exports.cancelWakeUpAndLock = function () {
    var isNotTask = !engines.myEngine().execArgv.intent;
    if (!isNotTask) {
        device.cancelKeepingAwake();
        lockScreen();
        resetDeviceBrightness_Mode();
        resetDeviceBrightness();
    }
}