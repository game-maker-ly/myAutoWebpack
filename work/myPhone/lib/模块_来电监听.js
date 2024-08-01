importClass(android.telephony.TelephonyManager);
importClass(android.content.Intent);
importClass(android.content.IntentFilter);


/**
 * 注册电话状态广播接收器
 */
var isInit = false;
function registerPhoneStateReceiver() {
    if (isInit) return;
    let filter = new IntentFilter();
    filter.addAction("android.intent.action.PHONE_STATE"); // 监听电话状态变化
    // 这里是通过全局的广播接收器接收
    // 还有根据通话状态来监听的
    let myBroadcastReceiver = new JavaAdapter(android.content.BroadcastReceiver, {
        /**
         * 接收广播回调函数
         * @param {android.content.Context} context 广播上下文对象
         * @param {Object} intent 广播意图对象
         */
        onReceive: function (context, intent) {
            let action = intent.getAction();
            // log(action);
            if ('android.intent.action.PHONE_STATE' == action) {
                // 监听来电状态
                // state需要手动转型，不然switch不通过，不像if-else会自动转型
                // 另外TelephonyManager.CALL_STATE_IDLE是数字的形式，不适合用
                let state = intent.getStringExtra(TelephonyManager.EXTRA_STATE) + "";
                let mIncomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
                // log(state == "IDLE");
                // 抛给上层，连状态和号码一起
                switch (state) {
                    case "IDLE":
                        // 挂断电话
                        log("挂断电话");
                        events.broadcast.emit("onMyPhoneStateChanged", state, mIncomingNumber);
                        break;
                    case "RINGING":
                        // 电话正在响铃
                        log("电话正在响铃");
                        events.broadcast.emit("onMyPhoneStateChanged", state, mIncomingNumber);
                        break;
                    case "OFFHOOK":
                        // 电话处于通话状态
                        log("电话处于通话状态");
                        events.broadcast.emit("onMyPhoneStateChanged", state, mIncomingNumber);
                        break;
                    default:
                        break;
                }
            }
        }
    });
    context.registerReceiver(myBroadcastReceiver, filter); // 注册广播接收器
    events.on('exit', () => {
        log("销毁来电监听");
        // 取消注册广播接收器，否则会导致内存泄露
        context.unregisterReceiver(myBroadcastReceiver);
    });

    setTimeout(() => {
        exit();
        // 用于脚本保活，ui界面不需要
    }, 5 * 3600 * 1000);
    isInit = true;  // 只注册一次
}

function _setPhoneStateListener(callback_Func) {
    registerPhoneStateReceiver();

    // 仅注册一次
    events.broadcast.on("onMyPhoneStateChanged", function(state, phone){
        log("此时通话状态："+state+"，来电号码："+phone);
        callback_Func && callback_Func(state, phone);
    });
}


exports.setPhoneStateListener = function(callback_Func){
    _setPhoneStateListener(callback_Func);
}