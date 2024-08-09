// 既然已经root了，那就没必要依赖autojs的广播了
// 息屏延时大概在2分钟左右
// 结合xposed edge事件触发autojs脚本
// xposed edge应该可以接管手电筒
// 那autojs就负责一些定制化的东西
// 比如调用tts进行语音播报
// 广播触发交给edge
// 还有一些操作比较麻烦，比如数据的开启和关闭
// 安卓原生是没有这个接口的，需要反射，还需要权限（安卓5.1以上
// 不如直接用root命令得了
// 省电模式的开启与关闭


// 省电模式貌似没有提供直接的命令
// 飞行模式会影响电话接通，建议不要使用
// 电话本来就是为了在任何状态下都能使用，
// 不同于平板，飞行模式下wx能安分点，另外是否能将微信在没网的时间段关掉呢
// 目前而言autojs没有足够的权限，没啥大用，后台清理都是交给管家的
// 而且由于冷启动可能更耗电，进电池优化即可，不需要提权乱搞

//adb shell settings put global low_power 1：模拟设备省电模式

// 来电接听触发无障碍？
// 目前考虑早上7点钟天气预报
// 12点整
// 5点半，纯报时
// 晚上8点检测电量，那实际上也不需要电量不足广播，因为不是即时性的
// 不同于充满电

// 定时任务，类似闹钟一样设置
const voiceTool = require("../lib/模块_语音王.js");
const weatherTool = require("../net/天气预报网络接口.js");
const adbTool = require("../lib/root/模块_adb命令.js");

// 这个思路基本寄了
// edge自己接收广播倒是快，但是唤起autojs太慢了
// edge倒是有打开指定活动的功能，但是和autojs不兼容


// 也就是说必须分开
// 有些语音可以用edge播报
// 不过复杂逻辑还得上autojs

// 首先edge可以做到绝大部分简单操作
// 但不能唤起应用
// 纯语音播报可以交给edge
// 目前交给edge的有，亮屏动作，息屏动作
// 电量充满，充电器连接和断开
// 手电筒（音量键，




var now_h = new Date().getHours();
var time_str = voiceTool.getSpeakerTime();
// 提前打开网络
if(now_h < 9){
    // 打开网络
    adbTool.setSvcDataEnable(true);
}
voiceTool.speak("现在是北京时间，" + time_str);

if (now_h < 9) {
    // 9点之前则自动播报天气
    // 息屏执行，不需要唤醒
    // 播报当天天气，忽略温度和告警
    var weatherStr = weatherTool.getSpeakerString(0, true, true);
    weatherStr && voiceTool.speak(weatherStr);
    // 播报完毕关闭网络
    adbTool.setSvcDataEnable(false);
} else if (now_h > 19) {
    // 触发电量检测，获取当前电量，如果小于20%，语音提示充电
    let battery = device.getBattery();
    if (battery < 20) {
        voiceTool.speak("电量不足，请及时充电。");
    }
}