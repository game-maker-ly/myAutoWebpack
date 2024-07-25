var dyApp = require("../app/打开抖音.js");

// 随机关键词，目前写死在代码里
// 考虑通过接口获取
// 获取抖音的热点榜，或其他的热点榜也行
// 对于教做饭，添加固定的美食博主即可，
// 其他tag不精准，有用ai洗稿的，有不讲解的
// 倒是新闻随机性较强


// 从配置文件更新，数组只需要读一次
const msbz = open("./cfg/美食博主.txt");
var keywords_list = msbz.readlines();
log(keywords_list);

// 这里不同的参数，只有keyword的来源，读取不同的配置文件
// 那在这里设置一个广播接收函数
// 在打开抖音里设置一个广播发送（动作是固定的
// 区别只在于怎么处理
// 比如我监听到摇一摇事件，那dyapp就抛出这个事件
// 给美食这里处理，如果没注册回调
// 那就忽略
// 当然可以用参数，配合是否初始化广播
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