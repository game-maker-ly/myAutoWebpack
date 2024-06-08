exports.openMGTV = function(clipId, videoId){
    var videoUrl = util.format("imgotv://player?videoId=%d&pos=2&cxid=&dc=5&clipId=%d&plId=0&from=mphone&t=&barrage=&f=&start_time=0&vrsdef=&callt=1717469073613", videoId,clipId);

    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });
}

