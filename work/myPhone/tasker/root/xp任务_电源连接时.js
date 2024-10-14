// xp任务
// const voiceTool = require("../../lib/模块_语音王.js");
const lockTool = require("../../lib/模块_锁.js");

log("电源连接触发");
// 语音播报充电器已连接
lockTool.setLocked(true, "battery_lock");
// voiceTool.speak("充电器已连接，正在充电");

