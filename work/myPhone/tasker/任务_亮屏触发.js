// 息屏触发的任务
// 和亮屏触发任务结合使用
const phoneStateListenerTool = require("../lib/模块_来电监听.js");
const btnListenerTool = require("../lib/模块_按键监听.js");
const scriptTool = require("../lib/模块_脚本管理.js");
const lockTool = require("../lib/模块_锁.js");
const voiceTool = require("../lib/模块_语音王.js");


// 如果锁住
if (lockTool.getLocked()) {
    // 就停止执行
    exit();
} else {
    // 设置锁
    lockTool.setLocked(true);
}
// 触发按键监听，回调传入手电筒执行函数
// 清理其他脚本
scriptTool.closeOtherScript();
log("亮屏触发");
// 重复触发了，得防止重复
// 来电监听
phoneStateListenerTool.setPhoneStateListener((state, phone) => {
    if (state == "OFFHOOK") {
        // log("接通电话");
        // 尝试按下免提
        // 等待免提
        // 这个监听可以监听到主动拨出，或接电话
        try {
            text("免提").findOne(6000).click();
        } catch (e) { }
    } else if (state == "RINGING") {
        // 响铃，即来电
        // 尝试获取姓名
        var nameUI = id("com.android.incallui:id/firstline").findOne(3000);
        if (nameUI) {
            var p_name = nameUI.text();
            voiceTool.speak(p_name+"打来电话");
        }
    } else {
        // log("挂断电话");
    }
});
// 按键监听
// 设置按键监听，若检测到有按键按下，则异步执行手电筒脚本
btnListenerTool.setClickListener((keyCode) => {
    // 音量键则按下手电筒
    if (keyCode == btnListenerTool.KEY_CODE.volume_up || keyCode == btnListenerTool.KEY_CODE.volume_down) {
        engines.execScriptFile("../shortcut/手电筒.js");
    } else if (keyCode == btnListenerTool.KEY_CODE.menu) {
        try {
            // 目前的情况，
            // 来电接听
            // 电话本拨号
            // 拨号界面拨号
            // 挂断（电源键，暂不考虑
            // 拨号键
            var sim_dial_btn = id("com.android.contacts:id/sim_dial_btn").findOnce();
            sim_dial_btn && sim_dial_btn.click();
            // 联系人电话
            var contact_data = id("com.android.contacts:id/data").findOnce();
            contact_data && contact_data.parent().parent().click();
            // 接听电话
            var unlock_answer = id("com.android.incallui:id/unlock_answer").findOnce();
            unlock_answer && unlock_answer.click();
        } catch (error) { }
    }
});


// 执行完毕，释放锁
lockTool.setLocked(false);

// 简单来说就是：息屏-》返回桌面，并停止其他脚本，开启一个按键监听任务（监听音量键按下则执行手电筒的快捷方式
// 亮屏则停止手电筒的监听，然后开启来电状态监听，如果接电话则修改为外放，如果挂电话就还原


// 目前的模块：模块_音量管理
// 模块_语音王，用于提示电量不足充电和充电完成，和电量变化，电源连接/断开任务结合使用
