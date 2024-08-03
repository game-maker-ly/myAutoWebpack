// 有概率出现锁上无法恢复的问题
// 在常驻任务里清空锁的数据

function _setLocked(lock, lockName){
    var storage = storages.create("TaskShared");
    var n = lockName ? lockName: "clean_locked";
    storage.put(n, lock);
}

function _getLocked(lockName){
    var storage = storages.create("TaskShared");
    var n = lockName ? lockName: "clean_locked";
    var isInit = storage.contains(n); 
    if(!isInit){
        // 若没有初始化clean_locked，那么就设其值为false
        _setLocked(false, n);
    }
    return storage.get(n);
}

function _clearLockDate(){
    storages.remove("TaskShared");
}

exports.clearLockDate = function(){
    _clearLockDate();
}

exports.setLocked = function(lock){
    _setLocked(lock);
}

exports.getLocked = function(){
    return _getLocked();
}