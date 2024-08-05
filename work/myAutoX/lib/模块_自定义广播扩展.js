importClass(android.content.IntentFilter);

// let myInterval;
// let myThread;
let myThread_lock;

// 动态注册一次销毁一次
// 那其实这个广播可以只注册一次，脚本结束时销毁
// 初始化广播
var isInit = false;
function _init() {
    if (isInit) return;
    isInit = true;
    // 初始化receiver
    let receiver = new JavaAdapter(android.content.BroadcastReceiver, {
        onReceive: function (context, intent) {
            threads.start(function () {
                myThread_lock = false;
            });
        },
    });

    // 注册广播
    let filter = new IntentFilter();
    // 使用自定义action拦截
    filter.addAction("android.intent.action.ly_create_shortcut");
    log("注册监听创建快捷方式完毕广播");
    context.registerReceiver(receiver, filter);

    events.on(("exit"), () => {
        log("销毁监听创建快捷方式完毕广播");
        receiver && context.unregisterReceiver(receiver);
    });
}


function waitBroadcastReceiver(callBack_func) {
    _init();
    // 发送广播
    // 这里就用创建快捷方式代替
    // 使用线程+while锁阻塞主线程
    myThread_lock = true;
    var myThread = threads.start(function () {
        callBack_func && callBack_func();
        while (myThread_lock);
    });
    myThread.join();
}


exports.waitBroadcastReceiver_Async = function (callBack_func) {
    waitBroadcastReceiver(callBack_func);
}