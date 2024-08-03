const flashLight = require("../app/打开手电筒.js");
const scriptTool = require("../lib/模块_脚本管理.js");

// 这里关闭其他脚本，会尝试关闭自己，导致触发两次exit
// 报错
if (flashLight.getFlashLightState()) {
    scriptTool.closeOtherScriptWithSameSource();
} else {
    flashLight.lightToggle();
}