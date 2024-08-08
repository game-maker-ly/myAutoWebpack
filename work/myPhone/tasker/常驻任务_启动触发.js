// autojs启动时触发，保证同时只有一个存在
// 需要在锁模块配置全局白名单
// 用来替代亮屏监听

// 这个方案有个问题，广播有很严重的延迟

// 息屏触发的任务
// 和亮屏触发任务结合使用
const phoneStateListenerTool = require("../lib/模块_来电监听.js");
const batteryStateListenerTool = require("../lib/模块_电池状态监听.js");
const btnListenerTool = require("../lib/模块_按键监听.js");
const scriptTool = require("../lib/模块_脚本管理.js");
const lockTool = require("../lib/模块_锁.js");
const voiceTool = require("../lib/模块_语音王.js");


// 息屏状态下还是延时较高
// 第一次打来电话百分比无法触发语音
// 因为广播延后了
// 如果能解决edge和autojs联动的问题
// 那就十分完美了

// 息屏状态下广播延时大概在2分钟左右
// 由xp模块接管充电器连接/断开，电量充满/不足，亮屏/息屏，手电筒，音量键
// 那基本上就是把这里的无障碍代码拆散到xp_task里面

// 判断是否已有运行实例
// 会把自己也判断进去
// 怎么说？
var isRuning = scriptTool.isExistSameSourceScript();
if (isRuning) {
    // 有则退出
    exit();
} else {
    // 开始不用清理，反正亮屏和息屏都会触发清理脚本
    // scriptTool.closeOtherScript();
    log("启动时触发");
    // 初始化锁的状态
    lockTool.clearLockDate();
    // 重复触发了，得防止重复
    // 来电监听
    // 这个edge做不到，而且延时很高，要求即时性
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
                voiceTool.speak(p_name + "打来电话");
            }
        } else {
            // log("挂断电话");
        }
    });
    // 按键监听
    btnListenerTool.setClickListener(() => {
        // 菜单键用于拨号和接听
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
    });
    // 电池状态
    /*
    batteryStateListenerTool.setBatteryStateListener((state) => {
        if(state == "low"){
            // 语音提示需要充电
            // 这里可以延迟定时播报，把电池状态存入storage
            // 如果定时检查，如果为low，那么就播报
            // 比如8点的时候
            log("电量不足");
            voiceTool.speak("电量不足，请及时充电");
        }else if(state == "okay"){
            log("充电已完成");
            voiceTool.speak("充电已完成");
        }
    });*/
}

// 奇了怪了，怎么单独写可以，换了就不行了
// 这个延时本身是没问题的，可以接受
// 问题大的是autojs本身的事件通知机制
// 既然事件通知会延时，那就用线程吧
// 尤其是电话这种对即时性要求很高的，不能用事件通知

// 目前的关键放在这个任务保活上面，通过延时函数一天一唤起，如果没问题就用这个方案
// 还能清理一下内存

// 说到底这个监听还是有时效的，得隔一天尝试重复唤醒
setTimeout(() => {
    var mySrc = engines.myEngine().getSource();
    // log(mySrc);
    // 这个延时即使自己停止也有效
    engines.execScriptFile(mySrc, { delay: 7000 });
    exit();
}, 24 * 3600 * 1000);