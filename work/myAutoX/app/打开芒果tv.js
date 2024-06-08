exports.openMGTV = function(videoId){
    var videoUrl = util.format("imgotv://player?videoId=%d", videoId);
    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });
}

