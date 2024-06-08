importClass(android.content.pm.ShortcutInfo);
importClass(android.graphics.BitmapFactory);
importClass(android.graphics.drawable.Icon);
importClass(android.app.PendingIntent);
importClass(android.net.Uri);
importClass(android.appwidget.AppWidgetHost);
importClass(android.R);

function checkIsSupported() {
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
        toastLog("本代码仅在华为安卓8手机上测试通过");
    } else {
        toastLog("需要安卓8(包含)以上");
    }
}

//需要的参数，图标路径
// 名称
// 调用js路径
// 图标路径
exports.createDesktopShortCut = function(s_id, s_name, s_path, i_path) {
    shortcutManager = context.getSystemService(context.SHORTCUT_SERVICE);
    requestPinShortcutSupported = shortcutManager.isRequestPinShortcutSupported();
    toastLog("启动器是否支持固定快捷方式: " + requestPinShortcutSupported);

    // 创建intent调用autojs的执行脚本act
    var shortcutInfoIntent = new Intent();
    shortcutInfoIntent.setAction("android.intent.action.VIEW");
    shortcutInfoIntent.setClassName("org.autojs.autojs", "org.autojs.autojs.external.open.RunIntentActivity");
    shortcutInfoIntent.setData(Uri.parse(files.path(s_path)));


    // 创建图标
    var icon_path = i_path;
    var name = s_name

    var bt_m = files.path(icon_path);
    // toastLog(bt_m);
    var bitmap = BitmapFactory.decodeFile(bt_m);
    icon = Icon.createWithBitmap(bitmap);



    let info = new ShortcutInfo.Builder(context, s_id)
        .setIcon(icon)
        .setShortLabel(name)
        .setLongLabel(name)
        .setIntent(shortcutInfoIntent)
        .build();


    var shortcutCallbackIntent = PendingIntent.getBroadcast(context, 0, shortcutInfoIntent, PendingIntent.FLAG_UPDATE_CURRENT);
    shortcutManager.requestPinShortcut(info, shortcutCallbackIntent.getIntentSender());
    // 以上的请求创建快捷方式是异步的，如果短时间收到大量请求，会忽略部分请求
    // 加个500ms的延时
    sleep(1000);
}


exports.delDesktopShortCut = function(shortcutId) {
    appWidgetHost= new AppWidgetHost(context, 1);
    //var ids=appWidgetHost.getAppWidgetIds();
    //toastLog(ids);
    appWidgetHost.deleteHost();
}