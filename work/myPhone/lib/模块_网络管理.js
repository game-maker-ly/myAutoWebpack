// 用于管理网络开关
// 模块太多了，得优化下二级目录结构
// 需要修改WiFi的权限
// 至于数据，在高版本安卓中不再有通用方法
// 或许可以通过无障碍来规避

/*
android 5.0以前
Android 5.0以前使用ConnectivityManager通过反射两个方法setMobileDataEnabled和getMobileDataEnabled来控制移动网络开和关。

5.0以后
Android 5.0以后使用TelephonyMananger类通过反射获取setDataEnabled和getDataEnabled类完成操作。
注意：Manifest需要使用添加android:sharedUserId=”android.uid.system“，系统需要root或者应用需要系统签名
*/


// 否则需要root，或adb，或伪造系统签名来做
function toggleWiFi(enabled) {
    var wm = context.getSystemService(context.WIFI_SERVICE);
    wm.setWifiEnabled(enabled);
}

// toggleWiFi(false);


/**
*移动网络开关
*/
function toggleMobileData(enabled) {
    var conMgr = context.getSystemService(context.CONNECTIVITY_SERVICE);

    //取得ConnectivityManager类
    var conMgrClass = conMgr.class;
    //取得ConnectivityManager类中的对象mService
    var iConMgrField = conMgrClass.getDeclaredField("mService");
    //设置mService可访问
    iConMgrField.setAccessible(true);
    //取得mService的实例化类IConnectivityManager
    var iConMgr = iConMgrField.get(conMgr);
    //取得IConnectivityManager类
    var iConMgrClass = iConMgr.class;
    //取得IConnectivityManager类中的setMobileDataEnabled(boolean)方法
    var setMobileDataEnabledMethod = iConMgrClass.getDeclaredMethod("setMobileDataEnabled", java.lang.Boolean.TYPE);
    //设置setMobileDataEnabled方法可访问
    setMobileDataEnabledMethod.setAccessible(true);
    //调用setMobileDataEnabled方法
    setMobileDataEnabledMethod.invoke(iConMgr, enabled);
}


toggleMobileData(true);

