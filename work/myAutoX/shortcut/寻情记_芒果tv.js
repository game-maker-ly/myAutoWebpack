var mgtvNet = require("../net/芒果tv网络请求.js");
var mgtvApp = require("../app/打开芒果tv.js");
var clipId = 611439;
var videoId = mgtvNet.getNewVideoId(clipId);
if(videoId == -1){videoId = 21093374;}

mgtvApp.openMGTV(clipId, videoId);

sleep(2000);

id("toFullScreen").findOne().click();