// 定时任务，类似闹钟一样设置
const voiceTool = require("../lib/模块_语音王.js");

var time_str = voiceTool.getSpeakerTime();
voiceTool.speak("现在是北京时间，"+time_str);