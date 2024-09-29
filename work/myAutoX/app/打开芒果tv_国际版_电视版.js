const myFloaty = require("../lib/模块_悬浮窗扩展.js");

// 还需要注册一个方法，来缓存进度
// 当脚本开始时获取当前时间
// 脚本退出时获取时间，得到脚本打开时长（可能需要校正
// 然后将打开时长与缓存中的时长累加，得到总的观看时长并缓存
// 下次打开就直接用playTime（用的是毫秒数）定位即可，需要写在app方法里
// 因为这个版本没办法记忆进度，不如手机版操作方便
// 需要对不同的videoId分开记忆进度
// 那只能放在openVideoId方法里面
// 但又有个问题，退出/换集都需要保存时间
// 那也就是要区分第一次打开和后续打开

// 是否需要重置播放进度
// 根据上次打开时间，还是总的观看时长？过滤videoId


var isFirst = true;
var lastVideoId;
var lastTime;
var play_time = 0;
const st = storages.create("MGTV.Cache.PlayTime");
// 芒果tv电视版，懒得转屏幕和找全屏控件了，直接用横屏的
function _openVideoById(videoId) {
    // 区分第一次调用
    if (isFirst) {
        isFirst = false;
        // 根据videoId记忆进度
        // 脚本退出时缓存观看时长（总
        // 仅注册1次，lastVideoId在这段代码之前是上一次videoId
        // 在这段代码之后就变为当前打开的videoId
        events.on("exit", function () {
            // 缩短播放时长，防止跳帧
            var curPlayTime = new Date() - lastTime - 3900;
            // 累加观看时长
            play_time += curPlayTime;
            log("记忆播放进度：" + play_time);
            st.put(lastVideoId, { totalTime: play_time, lastPlayTime: curPlayTime });
        });
    } else {
        // 换集记忆，记忆上次打开的videoId
        var curPlayTime = new Date() - lastTime - 3900;
        // 累加观看时长
        play_time += curPlayTime;
        log("记忆播放进度：" + play_time);
        st.put(lastVideoId, { totalTime: play_time, lastPlayTime: curPlayTime });
        log(lastVideoId);
        // 然后还需要设置这一集的进度
    }
    // 初次打开还是换集，从缓存中取出playTime都是共用的
    var pt_obj = st.get(videoId);
    log(pt_obj);
    if (!pt_obj) {
        // 如果缓存中没有，则视为0
        // 上次打开时长为极大值，用于之后过滤
        pt_obj = { totalTime: 0, lastPlayTime: 99999 };
    }
    /// 从缓存中取出总的观看时长，用于之后打开app
    play_time = pt_obj["totalTime"];
    log(play_time);
    // 暂存此次的id，用于下一次打开
    lastVideoId = videoId;
    // 暂存此次打开时间，用于保存时间差
    lastTime = new Date();


    // 需要销毁活动，否则partId不生效，或者结合clipId也是一样的效果
    // 这里partId就相当于videoId，还有个PlId，播放列表id
    // 国内版本可以使用fullScreen=1&fullPlay=1来达到全屏
    // 但国际版不行，有个选集列表无法关闭
    // 只能手动关闭
    // 国际版唯一的好处就是无更新和广告
    // 不过缺点就是片源少，另外部分scheme不生效
    var videoUrl = util.format("mgtvintl://vod/player?partId=%s&fullScreen=1&fullPlay=1", videoId);
    // 如果观看时长不为0，说明已有播放记录，则拼接playTime参数（单位毫秒
    videoUrl += "&playTime=" + (play_time + 100);
    log(videoUrl);
    // 直接拼接playTime
    app.startActivity({
        action: "VIEW",
        flags: ["ACTIVITY_CLEAR_TOP", "ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"],   //清除活动，返回主页，对芒果TV无效
        data: videoUrl
    });
    // 反正3s后自动隐藏节目单，就不手动点击了，主要是悬浮窗影响控件查找，能不用就不用
}
// 目前是通过vieeoId来实现跳转的
// 问题就在于获取上一个和下一个的videoId，比模拟操作要靠谱
// 毕竟控件挺麻烦的
function _openMGTV(videoId) {
    // 必须在屏幕旋转前创建，不然平板上会无法显示
    myFloaty.create2sidesBtn2click(true, false, () => {
        log("上一集");
        // 抛给上层
        events.broadcast.emit("onMyMgtvChangeNO", true);
    }, () => {
        log("下一集");
        events.broadcast.emit("onMyMgtvChangeNO", false);
    });
    // 延时1s启动，否则悬浮窗有概率无法正确显示
    sleep(1000);
    _openVideoById(videoId);

    // 用悬浮窗隐藏导航栏设置全屏
    // 需要注意的是，用此悬浮窗后会导致控件查找失效
    myFloaty.createFloaty2FullScreen(myFloaty.ORI_TYPE.Auto, true);
}

exports.openVideoById = function (videoId) {
    _openVideoById(videoId);
}

exports.openMGTV = function (videoId) {
    _openMGTV(videoId);
}