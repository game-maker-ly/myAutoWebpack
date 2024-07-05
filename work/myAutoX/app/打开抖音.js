function searchWithType_private(keyword, type) {
    var videoUrl = util.format("snssdk1128://search?keyword=%s", keyword);
    app.startActivity({
        action: "VIEW",
        data: videoUrl
    });
}


exports.searchWithType = function (keyword, type, isNewest = true) {
    searchWithType_private(keyword, type);
    // 等6s后操作
    sleep(3000);
    var bb = text("视频").findOnce().bounds();
    click(bb.centerX(), bb.centerY());
    sleep(3000);
    // 按最新排序
    // 实际上得根据不同设备来录
    // 就比如平板DPI和手机不同
    // 控件的坐标自然不同
    // 最理想的办法是定位到所需控件的坐标（哪怕是相对坐标也好
    // 次一点的做法就是看这个控件在整个屏幕里离边框的百分比
    // 然后就是这种写死坐标的方式
    // setScreenMetrics(1080, 2340);
    // 可以按最新排序
    if(isNewest){
        // 筛选
        click(1150, 250);// 得根据不同分辨率适配位置
        sleep(700);
        // 最新发布
        click(500, 500);
        sleep(700);
        // 返回
        click(500, 1600);
        sleep(3000);
    }
    

    click(300, 500);
}

