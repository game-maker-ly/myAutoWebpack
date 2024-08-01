importClass(android.content.IntentFilter);

let myInterval;
let myThread;

function waitBroadcastReceiver(callBack_func) {
    var flag = false;
    let receiver;

    // 初始化receiver
    var p1 = new Promise((resolve, reject) => {
        receiver = new JavaAdapter(android.content.BroadcastReceiver, {
            onReceive: function (context, intent) {
                resolve(true);
            },
        });
    }).then((res) => {
        // log(res);
        log("创建快捷方式结束广播");
        receiver && context.unregisterReceiver(receiver);
        log("关闭广播");

        // myThread.clearInterval(myInterval);
        // 退出当前线程
        myThread.interrupt();
    });

    // 注册广播
    let filter = new IntentFilter();
    // filter.addAction(Intent.ACTION_BATTERY_CHANGED);
    filter.addAction("android.intent.action.ly_create_shortcut");
    // filter.addAction("android.intent.action.激活路飞");
    context.registerReceiver(receiver, filter);

    // 发送广播
    // 这里就用创建快捷方式代替
    // 广播回调触发
    callBack_func && callBack_func();
    // 用定时器+子线程阻塞函数
    // 直到回调执行完毕
    // 理论上http的get，也可以用这个方法阻塞
    // 不过本来就需要异步下载，用重复广播反而是比较适合的
    myThread = threads.start(function(){
        myInterval = setInterval(() => {
            log("执行阻塞");
        }, 3000);
    });
    myThread.join();

    return p1;
}


exports.waitBroadcastReceiver_Async = function (callBack_func) {
    waitBroadcastReceiver(callBack_func);
}