// 息屏触发的任务
// 和亮屏触发任务结合使用
// 息屏状态下，无障碍失效，广播监听失效，按键监听失效
// 所以只适合用于清理
const scriptTool = require("../lib/模块_脚本管理.js");
const deviceTool = require("../lib/模块_设备操作.js");
const lockTool = require("../lib/模块_锁.js");
const adbTool = require("../lib/root/模块_adb命令.js");

// 锁的bug也很好理解，如果执行完毕就退出了，那将永远锁住

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
// log("息屏触发");
// 触发按键监听，回调传入手电筒执行函数
// 清理其他脚本，但是忽略手电筒，手电筒亮屏清理
scriptTool.closeOtherScriptWithIgnoreSource("手电筒");
// 返回桌面，交给edge pro
// deviceTool.goHome();
// 尝试清理后台
adbTool.killAllBackground();
// 打开省电模式
adbTool.setLowPowerEnable(true);



// 简单来说就是：息屏-》返回桌面，并停止其他脚本，开启一个按键监听任务（监听音量键按下则执行手电筒的快捷方式
// 亮屏则停止手电筒的监听，然后开启来电状态监听，如果接电话则修改为外放，如果挂电话就还原