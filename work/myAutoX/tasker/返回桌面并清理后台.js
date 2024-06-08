function goHome() {
    app.startActivity({
        action: "MAIN",
        category: "android.intent.category.HOME",
        flags: ["activity_clear_top"]
    });
}

goHome();
/*app.startActivity({
    packageName: "com.miui.securitycenter",
    className: "com.miui.optimizemanage.OptimizemanageMainActivity",
    //root: true
});*/