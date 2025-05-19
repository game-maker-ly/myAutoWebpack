// 这里编写重置桌面布局
// 并创建shortcut下面js的快捷方式到桌面
// 像微信可以就放在桌面备份里
// 创建快捷方式，需要知道名称，图标路径，脚本路径
// 这个干脆用1个文件维护起来吧，就不分开写了
// 并且这个文件也可以描述md5值
// 干脆用json，方便读写
// 假定名称是唯一的，那么就作为id
// 每次找就用名称找
// 手动维护好一点呢
// 还是自动维护？
// 考虑到同样的节目，可能有多个打开方式
// 固定命名规则肯定不可取，还是手动维护较好
// 不过md5值可以用代码遍历生成
// files.write('tasker/1.js', "test");
// log(engines.myEngine().cwd());
// var a = {"1":1,"2":2}
// log(Object.keys(a));
// 调用创建快捷方式到桌面
const scut_tool = require("../lib/模块_创建快捷方式.js");
const FileTool = require("../lib/模块_文件操作.js");
const NovaTool = require("../lib/模块_桌面操作.js");
const DeviceTool = require("../lib/模块_设备操作.js");

// 服了，哪怕是解锁了
// 也总是丢快捷方式
// 而且又是寻情记，
// 但之前测试过，id可以重复的
// 这个谜之bug
// 我只能认为是顺序的问题
// 第二个快捷方式会被莫名其妙吞掉
events.on("exit", function () {
    log("更新桌面布局已exit");
    DeviceTool.cancelWakeUpAndLock();
});


log("开始创建快捷方式");

var shortcutConfig = FileTool.getShortcutConfig();
// 创建之前先通知nova桌面回滚，回滚会自动返回桌面
NovaTool.restoreNovaDesktop();
sleep(9000);//等待回滚完毕
// 至少得等10s
// 2s还不够啊，服了
for (sid in shortcutConfig) {
    var sname = shortcutConfig[sid]["name"];
    var spath = "shortcut/" + shortcutConfig[sid]["path"];
    var i_path = "icon/" + shortcutConfig[sid]["icon_path"];
    log(sname + ":" + spath);
    scut_tool.createDesktopShortCut(sid, sname, spath, i_path);
}
// 给个5s锁屏应该够了（虽然不准
// 另外之前创建快捷方式的延时不准，导致总有漏的情况
sleep(5000);
log("结束创建快捷方式，执行锁屏");

// 这种线程挂起有概率阻塞，需要手动exit