// 息屏触发的任务
// 和亮屏触发任务结合使用
const scriptTool = require("../lib/模块_脚本管理.js");
const lockTool = require("../lib/模块_锁.js");
const adbTool = require("../lib/root/模块_adb命令.js");

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
// 清理其他脚本，这里只需要保证亮屏清理手电筒即可
scriptTool.closeOtherScript();
// log("亮屏触发");
// 重复触发了，得防止重复
// 亮屏打开数据，息屏关闭数据，不过这也可以用edge来实现

// 关闭省电模式
adbTool.setLowPowerEnable(false);

// 简单来说就是：息屏-》返回桌面，并停止其他脚本，开启一个按键监听任务（监听音量键按下则执行手电筒的快捷方式
// 亮屏则停止手电筒的监听，然后开启来电状态监听，如果接电话则修改为外放，如果挂电话就还原