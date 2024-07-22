
// 根据节目id获取最新的videoId
function _getNewsKeywordList(){
    var res = http.get("https://pcweb.api.mgtv.com/variety/showlist?collection_id="+collection_id);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        var newVideoInfo = rejson.data.list[0];
        // log(newVideoInfo);
        var videoId = newVideoInfo.video_id;
        var videoName = newVideoInfo.t3;
        log(videoId, videoName);
        return videoId;
    }
    return -1;
}


exports.getNewVideoId = function (collection_id) {
    return _getNewVideoId(collection_id);   
}