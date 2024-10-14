const lockTool = require("../lib/模块_锁.js");
const deviceTool = require("../lib/模块_设备操作.js");
const scriptTool = require("../lib/模块_脚本管理.js");


// 如果锁住
if (lockTool.getLocked()) {
    // 就停止执行
    exit();
} else {
    // 设置锁
    lockTool.setLocked(true);
    events.on("exit", function () {
        // 脚本退出一定要释放锁
        lockTool.setLocked(false);
    });
}


log("息屏触发：清除还在运行的脚本");
// 并清除正在运行的脚本，包括自身
scriptTool.closeOtherScript();

log("返回桌面");
deviceTool.goHome(); // 是先停止脚本，再返回桌面还是怎么办
log("已完成清除");
