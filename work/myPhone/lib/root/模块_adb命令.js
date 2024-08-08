//发一次熄灭屏幕，再发一次点亮屏幕。可以在板级没有接出power键时使用。
// adb shell input keyevent 26  // power事件。
// 一些常用的adb命令:
/* 4.飞行模式开：
adb shell settings put global airplane_mode_on 1
adb shell am broadcast -a android.intent.action.AIRPLANE_MODE --ez state true
5. 飞行模式关：
adb shell settings put global airplane_mode_on 0
adb shell am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false
1、adb控制移动数据
关闭：adb shell svc data disable
开启：adb shell svc data enable
2、WiFi开关
打开手机WIFI：adb shell svc wifi enable
关闭手机WIFI：adb shell svc wifi disable 

拨打电话，这个实际上就是用意图实现
adb shell am start -a android.intent.action.CALL -d tel:10086 

*/
// adb还是方便啊，不需要那么麻烦的安卓规范和权限，可惜默认root启用


// 开启和关闭数据
// 默认前缀adb shell，不需要重复加
function _setSvcDataEnable(isEnable) {
    var str = isEnable ? "enable" : "disable";
    var result = shell("svc data " + str, true);
    log(result);
}

exports.setSvcDataEnable = function(isEnable){
    _setSvcDataEnable(isEnable);
}
// 模拟电源键，锁屏和唤醒
// 坏处是无法确定是否唤醒了
function _clickPower() {
    var result = shell("input keyevent 26", true);
    log(result);
}
