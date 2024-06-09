exports.openMGTV = function(videoId){
    var videoUrl = util.format("imgotv://player?videoId=%s", videoId);
    toastLog(videoUrl);
    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });

    sleep(3000);
    // var btn = id("toFullScreen").findOne();
    click(1000, 600);// 全屏按钮
}

