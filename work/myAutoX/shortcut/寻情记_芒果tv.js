var mgtvNet = require("../net/芒果tv网络请求.js");
var mgtvApp = require("../app/打开芒果tv_当贝盒子版.js");
var clipId = 611439;    // 寻情记的合集id
var videoId = mgtvNet.getNewVideoId(clipId);
if(videoId == -1){videoId = 21093374;}

// log(videoId);
mgtvApp.openMGTV(videoId);


// 写个随机推荐，从列表中随机取出合集id
// 慢慢找吧，目前还没发现什么好看的
// 芒果tv上免费的都不好看

// 注册上下集事件
events.broadcast.on("onMyMgtvChangeNO", function(isPrev){
    videoId = mgtvNet.getNearVideoId(clipId, videoId, isPrev);
    var cid = mgtvNet.getCurYearId();
    if(cid){
        // 切换合集
        clipId = cid;
    }
    mgtvApp.openVideoById(videoId);
});