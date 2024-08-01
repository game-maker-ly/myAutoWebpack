function _closeOtherScript(isOnlySource) {
    var allEngines = engines.all();
    var myEngine_cur = engines.myEngine();
    for (let i = 0; i < allEngines.length; i++) {
        // 去除和自己同名的脚本，即source相同
        // 保证同时只有一个生效
        var c_engine = allEngines[i];
        // 得强转型，离谱
        var isCur = c_engine == myEngine_cur;
        var isSameSource =  c_engine.getSource() + "" == myEngine_cur.getSource() + "";
        var isNeedClose = !isCur && (!isOnlySource ||  isSameSource);
        if (isNeedClose) {
            // log(c_engine.getSource());
            c_engine.forceStop();
        }
    }
}

function _closeOtherScriptWithSameSource() {
    var allEngines = engines.all();
    var myEngine_cur = engines.myEngine();
    for (let i = 0; i < allEngines.length; i++) {
        // 去除和自己同名的脚本，即source相同
        // 保证同时只有一个生效
        var c_engine = allEngines[i];
        // 得强转型，离谱
        if (c_engine != myEngine_cur) {
            // log(c_engine.getSource());
            c_engine.forceStop();
        }
    }
}

exports.closeOtherScript = function(){
    _closeOtherScript(false);
}

exports.closeOtherScriptWithSameSource = function(){
    _closeOtherScript(true);
}