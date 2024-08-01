// 不行，如果把号码这种隐私信息写在代码里的话，问题很大

// 还是得去读联系人
// 基类
const myPhoneTool = require("../app/打开电话.js");


function _callTo(phone_no) {
    myPhoneTool.openCall(phone_no);
}

exports.callTo = function(phone_no){
    _callTo(phone_no);
}