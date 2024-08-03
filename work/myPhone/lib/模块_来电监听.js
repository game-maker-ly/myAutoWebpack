importClass(android.telephony.TelephonyManager);
importClass(android.content.Intent);
importClass(android.content.IntentFilter);

/*
*不能静态注册的广播:

  android.intent.action.SCREEN_ON

  android.intent.action.SCREEN_OFF

  android.intent.action.BATTERY_CHANGED

  android.intent.action.CONFIGURATION_CHANGED

  android.intent.action.TIME_TICK
*/

// 动态注册广播优先级高于静态广播
// 另外之前的延时是autojs本身的事件通知延时，不考虑修复的问题了（延时10-20s也不会修
// 直接用线程替代

// 所谓静态广播，就是需要在xml里面配合注册的广播，一般不考虑

// 另外来电监听还可以通过TelephonyManager服务的listen做到，不过效果应该和动态广播类似
// 并且不如动态广播通用，没有特殊的要求不考虑
// 而注册动态广播可以在app的activity里面，缺点是活动生命周期到了容易被销毁，不能持续
// 还有一种方案就是在自定义service里面注册，和现在的方案类似，定期尝试唤醒和清理
// 就是不知道autojs怎么实现自定义的service，没有找到现有的例子
// 后面再考虑吧，现在基本的效果已经实现


/**
 * 注册电话状态广播接收器
 */
var isInit = false;
var curPhoneState = "";
function registerPhoneStateReceiver(callback_Func) {
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
                // 抛给上层，连状态和号码一起
                // IDLE：挂断，OFFHOOK，为接通或者拨出（主动拨出也可触发
                // RINGING，来电
                // 都会触发两次，第一次的电话号码有概率为null
                // 用个变量保存状态，如果当前状态和传入状态一致，则不做操作
                if (mIncomingNumber && state != curPhoneState) {
                    // 不一致则暂存状态
                    curPhoneState = state;
                    // log("状态变化", curPhoneState, mIncomingNumber);
                    // 直接用线程，事件通知会延迟10-20s
                    threads.start(function () {
                        log("此时通话状态：" + state + "，来电号码：" + mIncomingNumber);
                        callback_Func && callback_Func(state, mIncomingNumber);
                    });
                    // events.broadcast.emit("onMyPhoneStateChanged", state, mIncomingNumber);
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

    // 自动退出在任务中实现，模块就不需要考虑了
    // setTimeout(() => {
    //     exit();
    //     // 用于脚本保活，ui界面不需要
    // }, 5 * 3600 * 1000);
    isInit = true;  // 只注册一次
}

// 会重复触发，需要用锁？
function _setPhoneStateListener(callback_Func) {
    registerPhoneStateReceiver(callback_Func);

    // 仅注册一次
    // 事件通知莫名延时很高，推测是省电优化的问题
    // 直接用线程运行
    // events.broadcast.on("onMyPhoneStateChanged", function (state, phone) {
    //     log("此时通话状态：" + state + "，来电号码：" + phone);
    //     callback_Func && callback_Func(state, phone);
    // });
}


exports.setPhoneStateListener = function (callback_Func) {
    _setPhoneStateListener(callback_Func);
}