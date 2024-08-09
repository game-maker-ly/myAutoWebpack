// 打开风云天气app，
const fyApp = require("../app/打开风云天气.js");

fyApp.open();

events.on("exit", function () {
    fyApp.close();
});

// 考虑5分钟自动关闭
setTimeout(() => {
    exit();
}, 5 * 60 * 1000);