// 全局白名单
const white_list = ["常驻任务"];
const white_reg = new RegExp(white_list.join("|"));

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
        // 全局白名单
        if(white_reg.test(c_engine_SRC)) continue;
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

// 有个有意思的地方，事件机制可以针对单个脚本通知
// 判断当前运行的脚本是否有同源的
function _isExistSameSourceScript(source){
    var allEngines = engines.all();
    var myEngine_cur = engines.myEngine();
    for (let i = 0; i < allEngines.length; i++) {
        var c_engine = allEngines[i];
        // 如果有同源的，则返回true
        if(c_engine.getSource() + "" == myEngine_cur.getSource() + "") return true;
    }
    // 否则返回false
    return false;
}

exports.isExistSameSourceScript = function(){
    return _isExistSameSourceScript();
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