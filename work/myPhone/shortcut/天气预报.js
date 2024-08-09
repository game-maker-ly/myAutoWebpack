// 打开风云天气app，
const fyApp = require("../app/打开风云天气.js");

fyApp.open();
// 这里不能用adb和延时器，会造成autojs任务无法退出
