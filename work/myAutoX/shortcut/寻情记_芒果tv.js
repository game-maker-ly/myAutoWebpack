var mgtvNet = require("../net/芒果tv网络请求.js");
var mgtvApp = require("../app/打开芒果tv_国际版_电视版.js");
var clipId = 820875;    // 寻情记的合集id，每年需要更新一次，由于规则可能会变更，暂不考虑重构代码
var videoId = mgtvNet.getNewVideoId(clipId);
if(videoId == -1){videoId = 24282206;}

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