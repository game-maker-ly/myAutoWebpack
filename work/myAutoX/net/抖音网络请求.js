// b站热榜：https://api.bilibili.com/x/web-interface/wbi/search/square?limit=50



// 获取热榜关键词数组
var news_keys_arr;
function _getNewsKeywordList() {
    var res = http.get("https://www.iesdouyin.com/web/api/v2/hotsearch/billboard/word/");
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        news_keys_arr = [];
        var word_list = rejson.word_list;
        for (let i = 0; i < word_list.length; i++) {
            // 目前label为17的一般是娱乐，为9的也差不多
            var label = word_list[i].label;
            if (label != 17 && label != 9) {
                var myKeyword = word_list[i].word;
                news_keys_arr.push(myKeyword);
            }
        }
        // log(news_keys_arr);
        return news_keys_arr;
    }
    return -1;
}

// 获取随机热榜关键词，或许可以根据热度加权随机？
// 后面再说吧
// 过滤掉一部分关键词
// 再去除已选的
// 随机索引替换为自增顺序
// 抖音关键词倒是不用，顺序不重要
// 如果news_keys_arr.length = 0，会报错
var rand_idx = 0;
function _getRandNewsKeyword() {
    if (!news_keys_arr || !news_keys_arr.length) {
        _getNewsKeywordList();
    }
    // 取出并移除对应idx的元素
    var rand_type = news_keys_arr[rand_idx];
    // 在数组索引范围内自增
    rand_idx = (rand_idx + 1) % news_keys_arr.length;
    // var rand_type = news_keys_arr.splice(rand_idx, 1)[0];
    return rand_type;
}

// log(_getRandNewsKeyword());

exports.getRandNewsKeyword = function (collection_id) {
    return _getRandNewsKeyword();
}

exports.getNewsKeywordList = function (collection_id) {
    return _getNewsKeywordList();
}