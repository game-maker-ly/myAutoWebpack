var fongMiApp = require("../app/打开OK影视.js");
const dsj_obj = {
    "暖春": {
        video_src: "可可",
        res_src: "蓝光226",
    },
    "正阳门下小女人": {
        video_src: "可可",
        res_src: "蓝光748",
    },
    "父母爱情": {
        video_src: "可可",
        res_src: "",
    },
    "人世间雷佳音": {
        video_src: "可可",
        res_src: "",
    },
    "老农民": {
        video_src: "可可",
        res_src: "FF线路",
    },
    "幸福到万家": {
        video_src: "可可",
        res_src: "",
    }
}
// 用随机？还是计数器？
// 计数器需要借助storage来缓存
// 缓存当前idx，以及上次退出时间
// 如果大于60s，则认为是连续打开，触发换剧事件
// 否则就维持上次打开的节目
const dsj_list = Object.keys(dsj_obj);
// 获取缓存
const st = storages.create("cache_fongmi");
// 尝试读取缓存时间
var nowT = st.get("lastExitTime");
// 尝试读取缓存idx
var curIdx = st.get("curIdx");
if(!curIdx){
    // 如果缓存中没有，则置为0，并且写入缓存
    curIdx = 0;
    st.put("curIdx", 0);
}
if (nowT) {
    // 计算当前距离上一次打开相差秒数
    nowT = Date.parse(nowT);
    var subTime = (new Date() - nowT) / 1000;
    // 如果超过60s，则维持原本idx
    // 否则进行自增
    if(subTime < 60){
        // 进行idx在dsj_list索引范围内的自增，并写入缓存
        // 仅当idx变化时才需要写入到缓存
        curIdx = (curIdx + 1) % dsj_list.length;
        st.put("curIdx", curIdx);
    }else{
        // 超时则不做操作，使用缓存里的idx
    }
}else{
    // 如果没有记录时间，说明也是第一次打开，那不做操作
}


events.on("exit", () => {
    // 记录退出时间
    var now = new Date();
    st.put("lastExitTime", now);
});
// 获取当前剧名
var rand_dsj = dsj_list[curIdx];
// 打开对应节目
fongMiApp.openFongMi(rand_dsj, dsj_obj[rand_dsj].video_src, dsj_obj[rand_dsj].res_src, true);