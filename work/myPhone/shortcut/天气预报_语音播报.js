// 访问官方接口，调用tts播报天气
const weatherTool = require("../net/天气预报网络接口.js");
const voiceTool = require("../lib/模块_语音王.js");
const adbTool = require("../lib/root/模块_adb命令.js");
// 这个破音也是绝了

// 息屏执行，不需要唤醒
// 打开网络
adbTool.setSvcDataEnable(true);
// 播报天气
var weatherStr = weatherTool.getSpeakerString();
weatherStr && voiceTool.speak(weatherStr);
// 关闭网络
adbTool.setSvcDataEnable(false);