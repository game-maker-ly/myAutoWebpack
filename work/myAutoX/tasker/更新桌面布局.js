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
// toastLog(engines.myEngine().cwd());
// var a = {"1":1,"2":2}
// toastLog(Object.keys(a));
// 调用创建快捷方式到桌面
const scut_tool = require("../lib/模块_创建快捷方式.js");
const FileTool = require("../lib/模块_文件操作.js");
const NovaTool = require("../lib/模块_桌面操作.js");

toastLog("开始创建快捷方式");

var shortcutConfig = FileTool.getShortcutConfig();
// 创建之前先通知nova桌面回滚
NovaTool.restoreNovaDesktop();
sleep(2000);//等待回滚完毕

for(sid in shortcutConfig){
    var sname = shortcutConfig[sid]["name"];
    var spath = "shortcut/"+shortcutConfig[sid]["path"];
    var i_path = "icon/"+shortcutConfig[sid]["icon_path"];
    toastLog(sname);
    scut_tool.createDesktopShortCut(sid, sname, spath, i_path);
}

