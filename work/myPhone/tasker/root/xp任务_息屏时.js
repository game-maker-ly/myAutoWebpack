// 息屏触发的任务
// 和亮屏触发任务结合使用
// 息屏状态下，无障碍失效，广播监听失效，按键监听失效
// 所以只适合用于清理

const scriptTool = require("../../lib/模块_脚本管理.js");
const deviceTool = require("../../lib/模块_设备操作.js");
const lockTool = require("../../lib/模块_锁.js");

// 如果锁住
if (lockTool.getLocked()) {
    // 就停止执行
    exit();
} else {
    // 设置锁
    lockTool.setLocked(true);
}
log("息屏触发");
// 清理其他脚本，但是忽略手电筒，手电筒亮屏清理
scriptTool.closeOtherScriptWithIgnoreSource("手电筒");
// 返回桌面
deviceTool.goHome();
// 执行完毕，释放锁
lockTool.setLocked(false);