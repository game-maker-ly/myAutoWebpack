const lockTool = require("./lib/模块_锁.js");
const scriptTool = require("./lib/模块_脚本管理.js");

// 亮屏触发，检测当前电量

// 如果锁住
if (lockTool.getLocked("xp_start")) {
    // 就停止执行
    exit();
} else {
    // 设置锁
    lockTool.setLocked(true, "xp_start");
    events.on("exit", function () {
        // 脚本退出一定要释放锁
        lockTool.setLocked(false, "xp_start");
    });
}

log("开机启动，则说明xp环境正常");
// 如果开机启动脚本执行，那么就说明xp环境正常
// 否则执行重启指令，（当然需要设置延时，倒计时30s，否则无限重启了
lockTool.setLocked(true, "xp_status");
// 并申请无障碍权限
toastLog("开始申请无障碍权限");
auto();