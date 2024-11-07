// 息屏触发的任务
// 和亮屏触发任务结合使用
const scriptTool = require("../../lib/模块_脚本管理.js");
const lockTool = require("../../lib/模块_锁.js");
const adbTool = require("../../lib/root/模块_adb命令.js");
const voiceTool = require("../../lib/模块_语音王.js");

// 比锁有bug
// 如果锁住
// 不修了,有几率永久锁住
if (lockTool.getLocked("screen_on")) {
    // 就停止执行
    exit();
} else {
    // 设置锁
    lockTool.setLocked(true, "screen_on");
    events.on("exit", function () {
        // 脚本退出一定要释放锁
        lockTool.setLocked(false, "screen_on");
    });
}
// 触发按键监听，回调传入手电筒执行函数
// 清理其他脚本，忽略来电脚本
scriptTool.closeOtherScriptWithIgnoreSource("来电");
// log("亮屏触发");
// 重复触发了，得防止重复
// 亮屏打开数据，息屏关闭数据，不过这也可以用edge来实现

// 关闭省电模式
adbTool.setLowPowerEnable(false);

// 检测当前电量
var battery_val = device.getBattery();
if (battery_val < 20) {
    log("电量过低，当前电量为：" + battery_val);
    // 并且如果没有在充电，那就语音提示充电，
    // 充电状态由充电器连接和拔出来修改
    if (!device.isCharging()) {
        voiceTool.speak("电量过低，请及时充电");
    }
}else if(battery_val == 100){
    // 若电量等于100，且充电器连接时，提示充电已完成
    // ps：xposed edge可以获取电量满广播，提示充电完成
    if (device.isCharging()) {
        log("电量已经充满");
        voiceTool.speak("充电已完成，请拔出充电器");
    }
}