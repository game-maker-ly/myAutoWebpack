// 有两个接口，可以获取，不知道是为了兼容还是怎样
// 一个是总接口，一个是综艺接口
// 而且节目排序还不一致
// 为了方便，规范一下，都是第0个为最新
// 在各自的业务层去反转数组
// cid是必须的，集合id，一般也代表某一年
// videoid和month选一个
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
    // 请求
    var res = http.get(url);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        // 这里需要把节目列表反转，保持第0个为最新
        if (!isNewest) {
            rejson.data.list.reverse();
        }
        return rejson;
    }
    return false;
}


// 根据节目id获取最新的videoId
function _getNewVideoId(collection_id) {
    // 不能传入vid
    var rejson = _getShowList(true, collection_id);
    if (rejson) {
        var newVideoInfo = rejson.data.list[0];
        // log(newVideoInfo);
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
    var rejson = _getShowList(isNewest, year_id);
    if (rejson) {
        var stream_list = rejson.data.list;
        return stream_list;
    }
    return -1;
}


// 根据当前月份，和传入月份数组，获取到相邻月份
// 也可以适用查找相邻videoId
// 如果不存在则返回-1
function _getNearMonth(paramName, month, tab_m, isPrev) {
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

function _getNearVideoId(collection_id, video_id, isPrev) {
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
        stream_list.reverse();
        tab_m.reverse();
        tab_y.reverse();
        // 先尝试获取附近的videoId
        var nearVideoId_tmp = _getNearMonth("video_id", video_id, stream_list, isPrev);
        // 不需要分页的情况
        if (nearVideoId_tmp != -1) {
            nearVideoId = nearVideoId_tmp;
            nearVideoName = _getVideoNameById("video_id", "t3", nearVideoId, stream_list);
        } else {
            // 没找到就需要分页找
            var near_month = _getNearMonth("m", cur_month, tab_m, isPrev);
            log("尝试查找附近月份");
            // 找到相邻月份，根据月份获取分页
            if (near_month != -1) {
                // 找出对应月份对应的节目页
                var stream_list_byMonth = _getPageByMonth(near_month, collection_id, isPrev);
                // 分页的情况
                var idx = !isPrev ? stream_list_byMonth.length - 1 : 0;
                nearVideoId = stream_list_byMonth[idx]["video_id"];
                nearVideoName = stream_list_byMonth[idx]["t3"];
            } else {
                // 没找到月份那就找年份
                log("尝试查找附近年份");
                var near_yid = _getNearMonth("id", cur_yid, tab_y, isPrev);
                var isNewest = isPrev;
                if (near_yid == -1) {
                    if (isPrev) {
                        // 假设是2022年，往上找不到
                        // 那就定位到最后一个，需要找最新的一期
                        near_yid = tab_y[tab_y.length - 1]["id"];
                    } else {
                        // 否则就定位回第0个
                        // 需要找第一期
                        near_yid = tab_y[0]["id"];
                    }
                } 
                var stream_list_byYear = _getPageByYearId(near_yid, isNewest);
                // 分页的情况
                var idx = !isPrev ? stream_list_byYear.length - 1 : 0;
                nearVideoId = stream_list_byYear[idx]["video_id"];
                nearVideoName = stream_list_byYear[idx]["t3"];
                // 暂存当前年份
                curYearId = near_yid;
            }
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

// var n_vid = _getNearVideoId(407130, 15624511, true);
// log(curYearId, n_vid);

exports.getCurYearId = function (collection_id) {
    return curYearId;   
}

exports.getNewVideoId = function (collection_id) {
    return _getNewVideoId(collection_id);   
}

exports.getNearVideoId = function (collection_id, video_id, isPrev) {
    return _getNearVideoId(collection_id, video_id, isPrev);   
}