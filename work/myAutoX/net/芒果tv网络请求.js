
// 根据节目id获取最新的videoId
function _getNewVideoId(collection_id){
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

// 主要是有分页，挺麻烦的
// 原理大致是，获取videoId所在的页，能保证videoId在数组里面
// 过滤极端情况，比如index为0，或为total-1，那说明在第一或者最后
// 该执行分页了
// 分页又分为上和下，如果找不到需要的页，说明没找到video

function _getPrevVideoId(collection_id, video_id, isPrev){
    var url = util.format("https://pcweb.api.mgtv.com/list/master?vid=%d&cid=%d&pn=1&ps=60&platform=4&src=mgtv&allowedRC=1&_support=10000000", video_id, collection_id);
    var res = http.get(url);
    if (res.statusCode == 200) {
        var videoId = -1;
        var rejson = res.body.json();
        var stream_list = rejson.data.list;
        for(let i=0; i < stream_list.length; i++){
            if(stream_list[i].video_id = video_id){
                // 找到当前节目位置
                // 找上一个
                if(isPrev){
                    // 没有上一个，需要分页，重新请求
                    if(i == 0){

                    }else{
                        videoId = stream_list[i - 1].videoId;
                    }
                    log("上一集是：");
                }else{
                    // 下一个
                    log("下一集是：");
                }
            }
        }
        return videoId;
    }
    return -1;
}


exports.getNewVideoId = function (collection_id) {
    return _getNewVideoId(collection_id);   
}