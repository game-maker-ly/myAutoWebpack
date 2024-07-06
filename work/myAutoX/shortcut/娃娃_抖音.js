var dyApp = require("../app/打开抖音.js");

// 从配置文件更新
const msbz = open("./cfg/娃娃关键词.txt");
var keywords_list = msbz.readlines();
log(keywords_list);

var rand_idx = random(0, keywords_list.length - 1);
var rand_ch_keyword = keywords_list[rand_idx];

var isSortByNewest = random(0, 1) == 1;
log(rand_ch_keyword+","+isSortByNewest);


dyApp.searchWithType(rand_ch_keyword, "video", isSortByNewest);