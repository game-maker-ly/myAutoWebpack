importClass(android.content.IntentFilter);

flag = false;
let receiver;

async function waitBroadcastReceiver(callBack_func){
    // 初始化receiver
    var p1=new Promise((resolve, reject) => {
        receiver = new JavaAdapter(android.content.BroadcastReceiver, {
            onReceive: function (context, intent) {
                resolve(true);
            },
        });
    });

    // 注册广播
    let filter = new IntentFilter();
    // filter.addAction(Intent.ACTION_BATTERY_CHANGED);
    filter.addAction("android.intent.action.ly_create_shortcut");
    // filter.addAction("android.intent.action.激活路飞");
    context.registerReceiver(receiver, filter);

    // 发送广播
    // 这里就用创建快捷方式代替
    callBack_func && callBack_func();
    // 广播回调触发
    await p1.then((res) => {
        // toastLog(res);
        toastLog("自定义创建快捷方式结束广播");
        if(res){
            // toastLog("关闭广播");
            flag = true;
            unregisterReceiver();// 关闭广播
            // 后面接下一个代码
        }
    });
    // app.sendBroadcast({
    //     action: "android.intent.action.yashu",
    //     extras: {
    //         author: "yashu",
    //     },
    // });
}


function unregisterReceiver() {
    if (flag) {
        receiver && context.unregisterReceiver(receiver);
        flag = false;
        toastLog("关闭广播");
    }
}

exports.waitBroadcastReceiver = async function(callBack_func){
    await waitBroadcastReceiver(callBack_func);
}