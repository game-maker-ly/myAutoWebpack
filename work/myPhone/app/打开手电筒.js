importClass(android.os.Build);

const isNewOs = isM();
var isSupported_FLASH = false;
var manager;// 新版手电管理
var m_Camera;// 旧版手电管理
if (isNewOs) {
    manager = context.getSystemService(context.CAMERA_SERVICE);
    // log(manager);
} /*else {
    importClass(android.hardware.Camera);
    importClass(android.content.pm.PackageManager);
    var pm = context.getPackageManager();
    var features = pm.getSystemAvailableFeatures();
    for (let i = 0; i < features.length; i++) {
        var f = features[i];
        if (PackageManager.FEATURE_CAMERA_FLASH.equals(f.name)) { // 判断设备是否支持闪光灯
            isSupported_FLASH = true;
            break;
        }
    }
}*/

// 脚本结束则关闭手电
// 正好有个锁屏停止所有脚本的任务
// 配合就是息屏关闭手电筒
events.on("exit", function(){
    log("退出手电筒脚本");
    // 关闭手电
    lightSwitch(false);
    // 重设状态
    _setLocked(false);
});
// log(isNewOs);
// 这么写有个问题
// 如果脚本结束了没回收的话
// 那就不能关上手电了
// 写个脚本销毁时触发关闭得了

function lightSwitch_old(lightStatus) {
    if (lightStatus) {
        if (m_Camera == null) {
            m_Camera = android.hardware.Camera.open();
        }
        var parameters = m_Camera.getParameters();
        parameters.setFlashMode(android.hardware.Camera.Parameters.FLASH_MODE_TORCH);
        m_Camera.setParameters(parameters);
        m_Camera.startPreview();
    } else {
        // 需要释放摄像头
        // 如果m_camera为null，就不做操作
        if(m_Camera == null) return;
        log("关闭手电");
        m_Camera.stopPreview();
        m_Camera.release();
        m_Camera = null;
    }
}

function lightSwitch_new(lightStatus) {
    if (manager == null) return;
    try {
        manager.setTorchMode("0", lightStatus);
    } catch (e) { }
}

function lightSwitch(lightStatus) {
    if (isNewOs) {
        lightSwitch_new(lightStatus);
    } else {
        lightSwitch_old(lightStatus);
    }
}

/**
 * 判断Android系统版本是否 >= M(API23)
 */
function isM() {
    if (Build.VERSION.SDK_INT >= 23) {
        return true;
    } else {
        return false;
    }
}

// 利用延时函数保证脚本阻塞
var myTimeout;
function lightToggle(){
    // 开关切换
    var isLightOpen = _getLocked();
    isLightOpen = !isLightOpen;
    _setLocked(isLightOpen);
    // 执行动作
    lightSwitch(isLightOpen);
    // 重置延时
    if(myTimeout){
        clearTimeout(myTimeout);
    }
    myTimeout = setTimeout(()=>{}, 5 * 3600 * 1000);
}

function _setLocked(lock){
    var storage = storages.create("TaskShared");
    storage.put("flash_state", lock);
}

function _getLocked(){
    var storage = storages.create("TaskShared");
    var isInit = storage.contains("flash_state"); 
    if(!isInit){
        // 若没有初始化clean_locked，那么就设其值为false
        _setLocked(false);
    }
    return storage.get("flash_state");
}

exports.getFlashLightState = function(){
    return _getLocked();
}

exports.lightToggle = function(){
    lightToggle();
}

