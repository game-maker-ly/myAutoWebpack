const voiceTool = require("../../lib/模块_语音王.js");
// 不会重复触发
log("电量充满触发");
// 上锁
voiceTool.speak("充电已完成");