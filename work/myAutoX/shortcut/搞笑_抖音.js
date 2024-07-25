var dyApp = require("../app/打开抖音.js");

// 从配置文件更新
const msbz = open("./cfg/搞笑关键词.txt");
var keywords_list = msbz.readlines();
log(keywords_list);


randOpenVideo();
// 接收广播信息
events.broadcast.on("DY_RE_search", function () {
    randOpenVideo();// 重新打开
});

function randOpenVideo() {
    var rand_idx = random(0, keywords_list.length - 1);
    var rand_ch_keyword = keywords_list[rand_idx];
    var sortType = dyApp.getRandSortType();
    // 随机关键词并打开抖音
    dyApp.searchWithType(rand_ch_keyword, "video", sortType);
}