var dyApp = require("../app/打开抖音.js");

// 随机关键词，目前写死在代码里
// 考虑通过接口获取
// 获取抖音的热点榜，或其他的热点榜也行
// 对于教做饭，添加固定的美食博主即可，
// 其他tag不精准，有用ai洗稿的，有不讲解的
// 倒是新闻随机性较强
var keywords_list = ["老饭骨","夏叔厨房", "爷俩儿好菜","美食作家王刚", "家常菜日记","马大厨教做菜"];

// 从配置文件更新
const msbz = open("./cfg/美食博主.txt");
keywords_list = msbz.readlines();
log(keywords_list);

var rand_idx = random(0, keywords_list.length - 1);
var rand_ch_keyword = keywords_list[rand_idx];

var isSortByNewest = random(0, 1) == 1;
log(rand_ch_keyword+","+isSortByNewest);


dyApp.searchWithType(rand_ch_keyword, "video", isSortByNewest);

