const lockTool = require("../lib/模块_锁.js");
const scriptTool = require("../lib/模块_脚本管理.js");
const voiceTool = require("../lib/模块_语音王.js");

// 亮屏触发，检测当前电量

// 如果锁住
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

log("亮屏触发：清除还在运行的脚本");
// 并清除正在运行的脚本
scriptTool.closeOtherScript();
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