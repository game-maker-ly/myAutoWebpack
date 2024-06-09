exports.openMyTv = function(){
    app.startActivity({
        action: "VIEW",
        packageName: "com.player.diyp2020",
        className: "com.hulytu.diypi.ui.SplashActivity"
    });
}