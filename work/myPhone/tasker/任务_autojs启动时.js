const lockTool = require("../lib/模块_锁.js");
const scriptTool = require("../lib/模块_脚本管理.js");

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
// 清除storage缓存，重置lockTool状态
lockTool.clearLockDate();



