const voiceTool = require("../../lib/模块_语音王.js");

var nameUI = id("com.android.incallui:id/firstline").findOne(3000);
if (nameUI) {
    var p_name = nameUI.text();
    voiceTool.speak(p_name + "打来电话");
}