var fongMiApp = require("../app/打开OK影视.js");
const dsj_obj = {
    "暖春": {
        video_src: "可可",
        res_src: "蓝光226",
    },
    "正阳门下小女人": {
        video_src: "萌米",
        res_src: "爱奇艺",
    },
    "父母爱情": {
        video_src: "可可",
        res_src: "",
    },
    "人世间": {
        video_src: "萌米",
        res_src: "爱奇艺",
    },
    "老农民": {
        video_src: "萌米",
        res_src: "",
    },
    "幸福到万家": {
        video_src: "可可",
        res_src: "",
    }
}
// 用随机？还是计数器？
// 计数器需要借助storage来缓存
// 还是随机吧
const dsj_list = Object.keys(dsj_obj);
var rand_dsj = dsj_list[random(0, dsj_list.length - 1)];


fongMiApp.openFongMi(rand_dsj, dsj_obj[rand_dsj].video_src, dsj_obj[rand_dsj].res_src, true);