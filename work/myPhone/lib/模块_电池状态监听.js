importClass(android.content.Intent);
importClass(android.content.IntentFilter);

// 不知道autojs是否支持自定义服务
// 如果支持的话可以写在服务里面
// 可以通过广播
// 也可以通过battery_manager

/**
 * 注册电池状态广播
 */
var isInit = false;
function registerReceiver() {
    if (isInit) return;
    let filter = new IntentFilter();
    // 电量状态变化过于频繁，
    // 而电源连接与断开autojs有对应的服务
    // 只需要监听电池充满，电量不足
    // filter.addAction(Intent.ACTION_BATTERY_CHANGED);
    filter.addAction(Intent.ACTION_BATTERY_LOW);
    filter.addAction(Intent.ACTION_BATTERY_OKAY);
    // filter.addAction(Intent.ACTION_POWER_CONNECTED);
    // filter.addAction(Intent.ACTION_POWER_DISCONNECTED);
    // 这里是通过全局的广播接收器接收
    // 还有根据通话状态来监听的
    let myBroadcastReceiver = new JavaAdapter(android.content.BroadcastReceiver, {
        // 
        onReceive: function (context, intent) {
            let action = intent.getAction();
            // log(action);
            var state;
            // 简单转换一下
            if(action == Intent.ACTION_BATTERY_LOW){
                state = "low";
            }else if(action == Intent.ACTION_BATTERY_OKAY){
                state = "okay";
            }
            state && events.broadcast.emit("onMyBatteryStateChanged", state);
        }
    });
    context.registerReceiver(myBroadcastReceiver, filter); // 注册广播接收器
    events.on('exit', () => {
        log("销毁电池状态监听");
        // 取消注册广播接收器，否则会导致内存泄露
        context.unregisterReceiver(myBroadcastReceiver);
    });

    setTimeout(() => {
        exit();
        // 用于脚本保活，ui界面不需要
    }, 5 * 3600 * 1000);
    isInit = true;  // 只注册一次
}

// 会重复触发，需要用锁？
function _setListener(callback_Func) {
    registerReceiver();
    // 仅注册一次
    events.broadcast.on("onMyBatteryStateChanged", function (state) {
        log("电池状态:"+state);
        callback_Func && callback_Func(state);
    });
}

exports.setBatteryStateListener = function (callback_Func) {
    _setListener(callback_Func);
}