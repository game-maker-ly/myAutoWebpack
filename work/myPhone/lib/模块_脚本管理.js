function _closeOtherScript(isOnlySource, ignoreSource) {
    var allEngines = engines.all();
    var myEngine_cur = engines.myEngine();
    for (let i = 0; i < allEngines.length; i++) {
        // 去除和自己同名的脚本，即source相同
        // 保证同时只有一个生效
        var c_engine = allEngines[i];
        // 得强转型，离谱
        // 优先级最高，如果含有给定关键词，就直接忽略
        var c_engine_SRC = c_engine.getSource() + "";
        if(ignoreSource && c_engine_SRC.indexOf(ignoreSource) != -1){
            // 略过此次循环
            continue;
        }
        // 判断是否同源（脚本名是否相同，以及是否是当前脚本
        var isCur = c_engine == myEngine_cur;
        var isSameSource =  c_engine_SRC == myEngine_cur.getSource() + "";
        var isNeedClose = !isCur && (!isOnlySource ||  isSameSource);
        if (isNeedClose) {
            // log(c_engine.getSource());
            c_engine.forceStop();
        }
    }
}


exports.closeOtherScript = function(){
    _closeOtherScript(false);
}

exports.closeOtherScriptWithIgnoreSource = function(source){
    _closeOtherScript(false, source);
}

exports.closeOtherScriptWithSameSource = function(){
    _closeOtherScript(true);
}