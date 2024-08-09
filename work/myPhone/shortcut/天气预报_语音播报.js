// 访问官方接口，调用tts播报天气
const weatherTool = require("../net/天气预报网络接口.js");
const voiceTool = require("../lib/模块_语音王.js");
const adbTool = require("../lib/root/模块_adb命令.js");
// 这个破音也是绝了

// 快捷方式是在亮屏的状态下执行的
// 只需要保证亮屏有网即可，没必要频繁开关网络？
// 打开网络
// 这里有个问题，打开网络开关之后，不一定能访问
// 得延时，这样体验又不好
// 那还是交给edge吧
// 播报天气
var weatherStr = weatherTool.getSpeakerString();
weatherStr && voiceTool.speak(weatherStr);