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
if(battery_val < 20){
    log("电量过低，当前电量为："+battery_val);
    voiceTool.speak("电量过低，请及时充电");
}

