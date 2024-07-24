var dyApp = require("../app/打开抖音.js");

// 默认精选首页
dyApp.openHome("关注");
var zb = textContains("直播中").findOne(3000);
if(zb){
    // 假如是直播就往下滑
    swipe(500, 1500, 500, 20, 500);
}