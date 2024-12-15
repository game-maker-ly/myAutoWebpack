var dyApp = require("../app/打开抖音.js");

// 自定义关键词待选列表
const keywords_list = ["冬天中医老年人腰椎禁忌", "中医腰椎禁忌", "中医腰椎老年人食物忌口", "中医腰椎疼与寒湿的关系", "中医腰椎寒湿饮食推荐"];

// 执行随机搜索关键词打开
randOpenVideo();
// 接收广播信息
// 广播重复触发得想个办法解决
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