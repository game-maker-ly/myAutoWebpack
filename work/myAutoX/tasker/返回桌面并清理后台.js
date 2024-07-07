function goHome() {
    app.startActivity({
        action: "MAIN",
        category: "android.intent.category.HOME",
        flags: ["activity_clear_top"]
    });
}

// 这里理论上不需要线程锁，因为会手动结束所有脚本
// 理论上不会重复触发，不会卡才对
log("触发返回桌面事件");
goHome();
// 并清除正在运行的脚本，包括自身
engines.stopAll();

/*app.startActivity({
    packageName: "com.miui.securitycenter",
    className: "com.miui.optimizemanage.OptimizemanageMainActivity",
    //root: true
});*/