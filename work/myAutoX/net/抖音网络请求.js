
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
function _getRandNewsKeyword() {
    if (!news_keys_arr || !news_keys_arr.length) {
        _getNewsKeywordList();
    }
    var rand_idx = random(0, news_keys_arr.length - 1);
    // 取出并移除对应idx的元素
    var rand_type = news_keys_arr.splice(rand_idx, 1)[0];
    return rand_type;
}

// log(_getRandNewsKeyword());

exports.getRandNewsKeyword = function (collection_id) {
    return _getRandNewsKeyword();
}