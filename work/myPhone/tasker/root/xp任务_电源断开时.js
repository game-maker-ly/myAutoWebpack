// const voiceTool = require("../../lib/模块_语音王.js");
const lockTool = require("../../lib/模块_锁.js");
// 不会重复触发

log("电源断开时触发");
// 上锁
// voiceTool.speak("充电器已拔出");
lockTool.setLocked(false, "battery_lock");