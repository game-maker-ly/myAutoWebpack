importClass(android.content.pm.ShortcutInfo);
importClass(android.graphics.BitmapFactory);
importClass(android.graphics.drawable.Icon);
importClass(android.app.PendingIntent);
importClass(android.net.Uri);
importClass(android.appwidget.AppWidgetHost);
importClass(android.R);

const MyBroadcastTool = require("./模块_自定义广播扩展.js");

function checkIsSupported() {
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
        log("本代码仅在华为安卓8手机上测试通过");
    } else {
        log("需要安卓8(包含)以上");
    }
}

let shortcutManager;
var isInit = false;
function _init(){
    if(isInit) return;
    isInit = true;
    // 获取快捷方式管理器，只需要初次获取
    shortcutManager = context.getSystemService(context.SHORTCUT_SERVICE);
    let requestPinShortcutSupported = shortcutManager.isRequestPinShortcutSupported();
    log("启动器是否支持固定快捷方式: " + requestPinShortcutSupported);
}


function createDesktopShortCut(s_id, s_name, s_path, i_path){
    // 尝试初始化
    _init();
    // 创建intent调用autojs的执行脚本act
    var shortcutInfoIntent = new Intent();
    shortcutInfoIntent.setAction("android.intent.action.VIEW");
    shortcutInfoIntent.setClassName("org.autojs.autojs", "org.autojs.autojs.external.open.RunIntentActivity");
    shortcutInfoIntent.setData(Uri.parse(files.path(s_path)));

    // 创建图标
    var icon_path = i_path;
    var name = s_name;
    // 以位图格式载入图片
    var bt_m = files.path(icon_path);
    var bitmap = BitmapFactory.decodeFile(bt_m);
    icon = Icon.createWithBitmap(bitmap);
    // 生成快捷方式信息
    let info = new ShortcutInfo.Builder(context, s_id)
        .setIcon(icon)
        .setShortLabel(name)
        .setLongLabel(name)
        .setIntent(shortcutInfoIntent)
        .build();

    // 通过广播来监听创建完毕回调，如果通过就继续执行
    var succIntent = new Intent();
    succIntent.setAction("android.intent.action.ly_create_shortcut");

    // 目前要做的，给定Intent，执行创建快捷方式请求并触发广播
    // 然后用子线程阻塞
    // 等待接收广播，抛出执行成功
    // 再继续执行

    var shortcutCallbackIntent = PendingIntent.getBroadcast(context, 0, succIntent, PendingIntent.FLAG_UPDATE_CURRENT);
    // 以广播+回调阻塞异步请求，使其顺序执行
    MyBroadcastTool.waitBroadcastReceiver_Async(() => {
        // log("当前执行："+name);
        shortcutManager.requestPinShortcut(info, shortcutCallbackIntent.getIntentSender());
    });
}

//需要的参数，图标路径
// 名称
// 调用js路径
// 图标路径
exports.createDesktopShortCut = function(s_id, s_name, s_path, i_path) {
    createDesktopShortCut(s_id, s_name, s_path, i_path);
}


exports.delDesktopShortCut = function(shortcutId) {
    appWidgetHost= new AppWidgetHost(context, 1);
    appWidgetHost.deleteHost();
}
