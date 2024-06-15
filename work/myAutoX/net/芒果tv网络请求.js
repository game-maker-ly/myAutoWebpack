
// 根据节目id获取最新的videoId

exports.getNewVideoId = function (collection_id) {
    var res = http.get("https://pcweb.api.mgtv.com/variety/showlist?collection_id="+collection_id);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        var newVideoInfo = rejson.data.list[0];
        var videoId = newVideoInfo.video_id;
        var videoName = newVideoInfo.t3;
        log(videoName);
        return videoId;
    }
    return -1;
}