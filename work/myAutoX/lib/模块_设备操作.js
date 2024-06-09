
var curBrightnerss = 240;

// 调用无障碍服务的接口实现锁屏动作
function lockScreen(){
    var success = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN);
    return success;
}

function setDeviceBrightness(b){
    curBrightnerss = device.getBrightness();
    device.setBrightness(b);
}

function resetDeviceBrightness(){
    device.setBrightness(curBrightnerss);
}

// 设置亮度 唤醒设备，
exports.wakeUpDevice = function(){
    var lowBrightnerss = 1;
    setDeviceBrightness(lowBrightnerss);
    device.keepScreenOn(300 * 1000);
}
// 恢复亮度，并锁屏
exports.cancelWakeUpAndLock = function(){
    device.cancelKeepingAwake();
    lockScreen();
    resetDeviceBrightness();
}