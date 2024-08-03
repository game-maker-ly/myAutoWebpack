// 用于管理网络开关
// 模块太多了，得优化下二级目录结构
function toggleWiFi(enabled) {
    var wm = contex.getSystemService(Context.WIFI_SERVICE);
    wm.setWifiEnabled(enabled);
}

toggleWiFi(true);


/**
*移动网络开关
*/
function toggleMobileData(enabled) {
    var conMgr = context.getSystemService(context.CONNECTIVITY_SERVICE);
    try {
        //取得ConnectivityManager类
        var conMgrClass = conMgr.class;
        //取得ConnectivityManager类中的对象mService
        var iConMgrField = conMgrClass.getDeclaredField("mService");
        //设置mService可访问
        iConMgrField.setAccessible(true);
        //取得mService的实例化类IConnectivityManager
        var iConMgr = iConMgrField.get(conMgr);
        //取得IConnectivityManager类
        var iConMgrClass = Class.forName(iConMgr.getClass().getName());
        //取得IConnectivityManager类中的setMobileDataEnabled(boolean)方法
        var setMobileDataEnabledMethod = iConMgrClass.getDeclaredMethod("setMobileDataEnabled", Boolean.TYPE);
        //设置setMobileDataEnabled方法可访问
        setMobileDataEnabledMethod.setAccessible(true);
        //调用setMobileDataEnabled方法
        setMobileDataEnabledMethod.invoke(iConMgr, enabled);
    } catch{};
}

