// 有两个接口，可以获取，不知道是为了兼容还是怎样
// 一个是总接口，一个是综艺接口
// 而且节目排序还不一致
// 为了方便，规范一下，都是第0个为最新
// 在各自的业务层去反转数组
// cid是必须的，集合id，一般也代表某一年
// videoid和month选一个
// 是否需要缓存同样url的结果？
var lastUrl;
var lastRejson;

var isIgnoreCache = false;
const st = storages.create("MGTV.Cache.PlayTime");
function _getShowList(isNewest, collection_id, video_id, month) {
    var url;
    if (isNewest) {
        url = "https://pcweb.api.mgtv.com/variety/showlist?collection_id=" + collection_id;
        // 可选参数
        if (video_id) {
            url += "&video_id=" + video_id;
        }
    } else {
        url = util.format("https://pcweb.api.mgtv.com/list/master?cid=%d&pn=1&ps=60&platform=4&src=mgtv&allowedRC=1&_support=10000000", collection_id);
        // 可选参数
        if (video_id) {
            url += "&vid=" + video_id;
        }
    }
    if (month) {
        url += "&month=" + month;
    }
    var rejson;
    // 重新请求
    if (lastUrl != url) {
        lastUrl = url;
        var res = http.get(url);
        // 如果请求失败返回false
        if (res.statusCode != 200) return false;
        rejson = res.body.json();
        // 深拷贝
        lastRejson = JSON.parse(JSON.stringify(rejson));
    } else {
        // 调用缓存
        rejson = JSON.parse(JSON.stringify(lastRejson));
    }
    // 这里需要把节目列表反转，保持第0个为最新
    if (!isNewest) {
        rejson.data.list.reverse();
    }
    // isIgnoreCache为true，那么就过滤缓存中的videoId
    // 还是用局部变量吧，主要是耦合太高了
    // 用递归？跳过挺难搞的，因为会导致一个问题，
    // list_tmp可能为空，这样会报错
    // 当list_tmp为空，需要清理当前月？
    // 还是用递归？
    // 简单来说，可能会存在从2024最新一集，直接跳到2022第一集的极端情况
    // 最好还是模拟一步步跳吧
    // log(rejson.data.list);
    if (isIgnoreCache) {
        var list_tmp = [];
        for (let i = 0; i < rejson.data.list.length; i++) {
            var tmp = rejson.data.list[i];
            var vid = tmp["video_id"];
            if (st.contains(vid)) {
                var lastPlayTime = st.get(vid)["lastPlayTime"];
                // 当打开时间超过30s，则认为没有看过，否则过滤
                if (lastPlayTime > 30000) {
                    list_tmp.push(tmp);
                }
            } else {
                // 缓存中没有则直接添加
                list_tmp.push(tmp);
            }
        }
        rejson.data.list = list_tmp;
    }
    // log("测试后：", rejson.data.list);
    return rejson;
}


// 根据节目id获取最新的videoId
function _getNewVideoId(collection_id) {
    isIgnoreCache = false;
    // 不能传入vid
    var rejson = _getShowList(true, collection_id);
    if (rejson) {
        var newVideoInfo = rejson.data.list[0];
        var videoId = newVideoInfo.video_id;
        var videoName = newVideoInfo.t3;
        log(videoName);
        return videoId;
    }
    return -1;
}


// 根据月份获取对应合集的页
function _getPageByMonth(month, collection_id, isNewest) {
    var rejson = _getShowList(isNewest, collection_id, null, month);
    if (rejson) {
        var stream_list = rejson.data.list;
        return stream_list;
    }
    return -1;
}

// 根据年份获取对应合集的页
function _getPageByYearId(year_id, isNewest) {
    return _getShowList(isNewest, year_id);
}


// 根据当前月份，和传入月份数组，获取到相邻月份
// 也可以适用查找相邻videoId
// 如果不存在则返回-1
// 这里没有考虑tab_m为[]的情况，会报错
// 或许要在这里使用递归？
function _getNearMonth(paramName, month, tab_m, isPrev) {
    // 反转
    tab_m = JSON.parse(JSON.stringify(tab_m));
    tab_m.reverse();
    var res_month = -1;
    for (let i = 0; i < tab_m.length; i++) {
        var m = tab_m[i][paramName];
        if (m == month) {
            // 找上一个或下一个
            if (isPrev) {
                if (i == 0) {
                    // log("找不到上一个");
                    // 可以在这里尝试调用年
                } else {
                    res_month = tab_m[i - 1][paramName];
                }
            } else {
                if (i == tab_m.length - 1) {
                    // log("找不到下一个");
                    // 可以在这里尝试调用年
                } else {
                    res_month = tab_m[i + 1][paramName];
                }
            }
            // 找到则直接返回
            return res_month;
        }
    }
    return res_month;
}

// 根据videoId获取videoName
function _getVideoNameById(paramName, res_paramName, video_id, stream_list) {
    for (let i = 0; i < stream_list.length; i++) {
        var vid = stream_list[i][paramName];
        if (video_id == vid) {
            return stream_list[i][res_paramName];
        }
    }
    return -1;
}

// 主要是有分页，挺麻烦的
// 原理大致是，获取videoId所在的页，能保证videoId在数组里面
// 过滤极端情况，比如index为0，或为total-1，那说明在第一或者最后
// 该执行分页了
// 分页又分为上和下，如果找不到需要的页，说明没找到video
// 这里需要自定义进度缓存，
// 以及过滤掉已有的videoId
// 调用这个方法，说明当前的video_id是看过了的，
// 那就需要缓存在storage，下次打开就跳过已缓存的
// 那干脆写在_getShowList方法里，用布尔值控制是否过滤


// 干脆在这里做个递归，当获取到不在缓存里面的则停止

function _getNearVideoId(collection_id, video_id, isPrev) {
    // log("触发_getNearVideoId方法---");
    // 获取网络数据
    // 问题在于要减少网络请求，来达到跳过重复值的目的
    isIgnoreCache = true;
    var cache_yid_list = [];
    var rejson = _getShowList(false, collection_id, video_id);
    if (rejson) {
        var nearVideoId = -1;
        var nearVideoName = -1;
        var stream_list = rejson.data.list; // 节目页
        var tab_m = rejson.data.tab_m;  // 月份页
        var cur_month = rejson.data.cur.m;  // 当前月份
        var tab_y = rejson.data.tab_y;  // 年份页
        var cur_yid = collection_id;  // 当前年份，准确来说是当前集合id
        // 反转年份，月份和节目页，升序排序
        // 先尝试获取附近的videoId
        var nearVideoId_tmp = _getNearMonth("video_id", video_id, stream_list, isPrev);
        // 不需要分页的情况
        if (nearVideoId_tmp != -1) {
            nearVideoId = nearVideoId_tmp;
            nearVideoName = _getVideoNameById("video_id", "t3", nearVideoId, stream_list);
        } else {
            // 没找到就需要分页找
            // 做个do_while循环？
            // 有个问题，month和year的循环要分开
            var isFound = false;
            var isYearChange = false;
            do {
                // 月份页是会随着当前年份而改变的，所以需要更改
                var near_month = cur_month;
                if (isYearChange) {
                    isYearChange = false;
                } else {
                    near_month = _getNearMonth("m", cur_month, tab_m, isPrev);
                }
                log("尝试查找附近月份：" + near_month);
                // 找到相邻月份，根据月份获取分页
                if (near_month != -1) {
                    // 找出对应月份对应的节目页
                    // getPageByMonth可能为[]，那也就说明该月份下节目已经看完
                    var stream_list_byMonth = _getPageByMonth(near_month, cur_yid, isPrev);
                    // 如果当前月份下都已看过，那么就continue循环
                    if (stream_list_byMonth.length == 0) {
                        // 月份翻页
                        cur_month = near_month;
                        continue;
                    }
                    // 分页的情况
                    var idx = !isPrev ? stream_list_byMonth.length - 1 : 0;
                    // log(idx, stream_list_byMonth);
                    nearVideoId = stream_list_byMonth[idx]["video_id"];
                    nearVideoName = stream_list_byMonth[idx]["t3"];
                    // 找到则终止循环
                    isFound = true;
                } else {
                    // 没找到月份那就找年份
                    var near_yid = _getNearMonth("id", cur_yid, tab_y, isPrev);
                    if (near_yid == -1) {
                        if (!isPrev) {
                            // 假设是2022年，往上找不到
                            // 那就定位到最后一个，需要找最新的一期
                            near_yid = tab_y[tab_y.length - 1]["id"];
                        } else {
                            // 否则就定位回第0个
                            // 需要找第一期
                            near_yid = tab_y[0]["id"];
                        }
                    }
                    log("尝试查找附近年份：" + near_yid);
                    // 这里也可能为[]
                    var pageInfoByYear = _getPageByYearId(near_yid, isPrev);
                    var stream_list_byYear = pageInfoByYear.data.list;
                    // 这个代表这个年是空的？
                    // 应该代表这一年最新月是空的，所以有问题，得交给月份去查
                    if (stream_list_byYear.length == 0) {
                        // 月份也要改
                        tab_m = pageInfoByYear.data.tab_m;
                        tab_m = JSON.parse(JSON.stringify(tab_m));
                        cur_month = isPrev ? tab_m[0].m : tab_m[tab_m.length - 1].m;
                        // 翻页重复了，
                        // log(cur_month, tab_m);
                        isYearChange = true;
                        // 移动年份
                        // 说明已经找完一圈，无法找到，结束循环
                        // 做个重试次数尝试，因为在只有一年的时候会报错
                        if (cache_yid_list.indexOf(near_yid) != -1) {
                            log("查找年份重试次数过多");
                            break;
                        }
                        // 缓存年份
                        cache_yid_list.push(cur_yid);
                        cur_yid = near_yid;
                        // 暂存当前年份
                        curYearId = near_yid;
                        // 当然也可能存在找一圈也没找到情况，需要避免
                        continue;
                    }
                    // 分页的情况
                    // 跨页查找
                    var idx = !isPrev ? stream_list_byYear.length - 1 : 0;
                    nearVideoId = stream_list_byYear[idx]["video_id"];
                    nearVideoName = stream_list_byYear[idx]["t3"];
                    isFound = true;
                    // 暂存当前年份
                    curYearId = near_yid;
                }
            } while (!isFound);
        }

        // 如果找到了
        if (nearVideoId != -1) {
            if (isPrev) {
                log("上一集是：" + nearVideoName);
            } else {
                log("下一集是：" + nearVideoName);
            }
        }

        return nearVideoId;
    }
    return -1;
}

// 根据年份分页?
// 只有年份才需要做一个圈循环，即：
// 假设当前为2024年，往上找是2023没问题
// 往下找不到2025，那么就将指针移回第0个，即2022年
// 节目表也对应到第0个

// 需要暂存年份和月份
// 那这得用一个变量保存
var curYearId;


exports.getCurYearId = function (collection_id) {
    return curYearId;
}

exports.getNewVideoId = function (collection_id) {
    return _getNewVideoId(collection_id);
}

exports.getNearVideoId = function (collection_id, video_id, isPrev) {
    return _getNearVideoId(collection_id, video_id, isPrev);
}