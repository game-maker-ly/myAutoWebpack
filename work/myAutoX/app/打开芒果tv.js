exports.openMGTV = function(videoId){
    var videoUrl = util.format("imgotv://player?videoId=%s", videoId);
    log(videoUrl);
    app.startActivity({
        action: "VIEW",
        //type: "text/plain",
        data: videoUrl
    });
    // 需要注意的是
    // 可能是版本问题，或者安卓底层调度问题
    // timer并不总是准确的
    // 会出现过快和过慢的情况，
    // 能用回调+线程阻塞达到同步的方法
    // 或者自带的waitFor方法
    // 就尽量避免用sleep();

    sleep(7000);
    // 纯坐标是对应不上的
    // var btn = id("toFullScreen").findOne();
    var videoContainer = idContains("main_container").findOne();
    var x = videoContainer.bounds().right - 80;
    var y = videoContainer.bounds().bottom - 80;
    click(x, y);// 全屏按钮
    sleep(900);
    click(x, y);
    // 这里其实可以用横屏来实现全屏，因为芒果tv的视频基本都是横屏
    // 不用去找随时可能改名的按钮
    // 但实现太复杂了
    // 原理就是在最上层构建一个透明的view
    // 然后对这个view进行旋转来达到全屏的目的
    // 安卓的代码都很长，autojs就算了
    
}

