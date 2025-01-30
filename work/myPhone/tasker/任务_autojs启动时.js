const lockTool = require("../lib/模块_锁.js");
const scriptTool = require("../lib/模块_脚本管理.js");
const adbTool = require("../lib/root/模块_adb命令.js");

// 亮屏触发，检测当前电量

// 如果锁住
if (lockTool.getLocked("autojs_start")) {
    // 就停止执行
    exit();
} else {
    // 设置锁
    lockTool.setLocked(true, "autojs_start");
    events.on("exit", function () {
        // 脚本退出一定要释放锁
        lockTool.setLocked(false, "autojs_start");
    });
}

log("autojs启动时触发");
// 如果开机启动脚本执行，那么就说明xp环境正常
// 否则执行重启指令，（当然需要设置延时，倒计时30s，否则无限重启了
sleep(30000);
if(!lockTool.getLocked("xp_status")){
    // 执行设备重启，默认xp状态就是false，不用重置lock
    adbTool.rebootPhone();
}


// 清除storage缓存，重置lockTool状态
lockTool.clearLockDate();
