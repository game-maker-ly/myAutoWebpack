// // 电源连接时写入锁，
// // 电源断开时解除锁
// // 如果锁存在，说明在充电，屏蔽电量变化事件
// // 否则电量变化达到指定值，播放电量不足提示，
// // 目前按20%，10%，5%来计算
// // 息屏触发的任务
// // 和亮屏触发任务结合使用

// // 触发太频繁，放弃这个事件，
// const lockTool = require("../lib/模块_锁.js");
// const voiceTool = require("../lib/模块_语音王.js");

// // 删掉log保电
// // log("电量变化时触发");
// // 保存一个旧电量？
// // 脱裤子放屁，反正都要去读电量

// // 触发太频繁了
// // 没有降频的方法么？
// // 读取电源连接状态
// // 弃用这个广播
// // 用okay和low广播
// var isCharge = lockTool.getLocked("battery_lock");
// var chargePoint = device.getBattery();
// if(isCharge){
//     // 充电只要判断电量等于100则播报语音提示
//     if(chargePoint == 100){
//         voiceTool.speak("充电已完成");
//     }
// }else{
//     // 达到指定电量，则播报电量不足，请及时充电
//     if([20,10,5].indexOf(chargePoint) != -1){
//         voiceTool.speak("电量不足，请及时充电");
//     }
// }
