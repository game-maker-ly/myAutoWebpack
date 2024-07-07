function goHome() {
    app.startActivity({
        action: "MAIN",
        category: "android.intent.category.HOME",
        flags: ["activity_clear_top"]
    });
}

function _setLocked(lock){
    var storage = storages.create("TaskShared");
    storage.put("clean_locked", lock);
}

function _getLocked(){
    var storage = storages.create("TaskShared");
    var isInit = storage.contains("clean_locked"); 
    if(!isInit){
        // 若没有初始化clean_locked，那么就设其值为false
        _setLocked(false);
    }
    return storage.get("clean_locked");
}

// 这里理论上不需要线程锁，因为会手动结束所有脚本
// 理论上不会重复触发，不会卡才对
// 实际上确实重复触发了
// 如果锁住
if(_getLocked()){
    // 就停止执行
    exit();
}else{
    // 设置锁
    _setLocked(true);
}
log("清除还在运行的脚本");
// 并清除正在运行的脚本，包括自身
var allEngines = engines.all();
var myEngine_cur = engines.myEngine();
for (let i = 0; i < allEngines.length; i++) {
    var c_engine = allEngines[i];
    if(c_engine != myEngine_cur){
        c_engine.forceStop();
    }
}
log("触发返回桌面事件");
goHome(); // 是先停止脚本，再返回桌面还是怎么办
log("已完成清除");
_setLocked(false);  //释放锁


/*app.startActivity({
    packageName: "com.miui.securitycenter",
    className: "com.miui.optimizemanage.OptimizemanageMainActivity",
    //root: true
});*/