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


exports.setLocked = function(lock){
    _setLocked(lock);
}

exports.getLocked = function(){
    return _getLocked();
}