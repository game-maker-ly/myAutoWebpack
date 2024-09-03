// b站热榜：https://api.bilibili.com/x/web-interface/wbi/search/square?limit=50
// 目前比较靠谱的只有百度新闻
const dyNet = require("./抖音网络请求.js");

// 是否需要加权随机？
// 基本逻辑都共通，唯一的区别就是json格式

// 获取热榜关键词数组
function _getNewsKeywordList_baidu() {
    var res = http.get("https://top.baidu.com/api/board?tab=realtime");
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        var res_list = [];
        var word_list = rejson.data.cards[0].content;
        for (let i = 0; i < word_list.length; i++) {
            var myKeyword = word_list[i].word;
            res_list.push(myKeyword);
        }
        return res_list;
    }
    return -1;
}

const news_type_list = ["dy", "bd"];
var cur_type = news_type_list[random(0, news_type_list.length - 1)];
var news_keys_arr;
function _getNewsKeywordList() {
    if (cur_type == "dy") {
        news_keys_arr = dyNet.getNewsKeywordList();
    } else {
        news_keys_arr = _getNewsKeywordList_baidu();
    }
}

// 获取随机热榜关键词，或许可以根据热度加权随机？
// 后面再说吧
// 过滤掉一部分关键词
// 再去除已选的
// 顺序自增，每次重新运行脚本都从0开始
var rand_idx = 0;
function _getRandNewsKeyword() {
    if (!news_keys_arr || !news_keys_arr.length) {
        _getNewsKeywordList();
    }
    // 取出并移除对应idx的元素
    var rand_type = news_keys_arr[rand_idx];
    // 在数组索引范围内自增
    rand_idx = (rand_idx + 1) % news_keys_arr.length;
    return rand_type;
}

// log(_getRandNewsKeyword());

exports.getRandNewsKeyword = function (collection_id) {
    return _getRandNewsKeyword();
}