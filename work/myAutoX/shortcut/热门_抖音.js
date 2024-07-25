const dyApp = require("../app/打开抖音.js");
const dyNet = require("../net/抖音网络请求.js"); 

// 初次打开
randOpenVideo();
// 接收广播信息
events.broadcast.on("DY_RE_search", function () {
    randOpenVideo();// 重新打开
});

function randOpenVideo() {
    var rand_ch_keyword = dyNet.getRandNewsKeyword();
    var sortType = dyApp.getRandSortType();
    // 随机关键词并打开抖音
    dyApp.searchWithType(rand_ch_keyword, "video", sortType);
}