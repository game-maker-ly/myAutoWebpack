var mgtvNet = require("../net/芒果tv网络请求.js");
var mgtvApp = require("../app/打开芒果tv.js");
var clipId = 611439;    // 寻情记的合集id
var videoId = mgtvNet.getNewVideoId(clipId);
if(videoId == -1){videoId = 21093374;}

// log(videoId);
mgtvApp.openMGTV(videoId);




/*
mgtvApp.registerSwipe((type) => {
    if(type == "UP"){
        log("下一集");
        mgtvApp.openVideoById();
    }else if(type == "DOWN"){
        log("上一集");
        mgtvApp.openVideoById();
    }
});*/