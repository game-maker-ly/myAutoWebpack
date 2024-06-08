function goHome() {
    app.startActivity({
        action: "MAIN",
        category: "android.intent.category.HOME",
        flags: ["activity_clear_top"]
    });
}

goHome();
// 并清除正在运行的脚本，包括自身
engines.stopAll();

/*app.startActivity({
    packageName: "com.miui.securitycenter",
    className: "com.miui.optimizemanage.OptimizemanageMainActivity",
    //root: true
});*/