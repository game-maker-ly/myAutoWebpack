function goHome() {
    app.startActivity({
        action: "MAIN",
        category: "android.intent.category.HOME",
        flags: ["activity_clear_top"]
    });
}

exports.goHome = function(){
    goHome();
}