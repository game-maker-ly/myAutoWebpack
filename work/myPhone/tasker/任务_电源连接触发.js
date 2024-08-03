// 电源连接时写入锁，
// 电源断开时解除锁
// 如果锁存在，说明在充电，屏蔽电量变化事件
// 否则电量变化达到指定值，播放电量不足提示，
// 目前按20%，10%，5%来计算
// 息屏触发的任务
// 和亮屏触发任务结合使用
const lockTool = require("../lib/模块_锁.js");
const voiceTool = require("../lib/模块_语音王.js");

// 不会重复触发

log("电源连接触发");
// 上锁，意义不大了，但还是保留，因为这个广播不会频繁触发，耗电也不大
// 语音播报充电器已连接
voiceTool.speak("充电器已连接，正在充电");
// lockTool.setLocked(true, "battery_lock");

