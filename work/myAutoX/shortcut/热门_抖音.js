const dyApp = require("../app/打开抖音.js");
const newsNet = require("../net/新闻网络请求.js");

// 初次打开
randOpenVideo();
// 接收广播信息
events.broadcast.on("DY_RE_search", function () {
    randOpenVideo();// 重新打开
});

// 考虑过滤掉一部分热搜词，如游戏
// 考虑不随机排序，就默认排序
// 后面慢慢写吧，一边找关键词，一边过滤
// 完善自己的规则

// 竖屏视频不能旋转，预料之内

function randOpenVideo() {
    var rand_ch_keyword = newsNet.getRandNewsKeyword();
    var sortType = dyApp.SORT_TYPE.Default; // 默认排序
    // 随机关键词并打开抖音
    dyApp.searchWithType(rand_ch_keyword, "video", sortType);
}