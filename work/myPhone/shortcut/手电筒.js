const flashLight = require("../app/打开手电筒.js");
const scriptTool = require("../lib/模块_脚本管理.js");

if (flashLight.getFlashLightState()) {
    scriptTool.closeOtherScriptWithSameSource();
} else {
    flashLight.lightToggle();
}