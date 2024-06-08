exports.openMGTV = function(videoId){
    var videoUrl = util.format("imgotv://player?videoId=%s", videoId);
    toastLog(videoUrl);
    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });
}

