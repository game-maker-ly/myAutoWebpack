function _openCall(phone_no){
    app.startActivity({
        action: "CALL",
        flags: ["ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"],    // 清除上次活动
        data: "tel:"+phone_no
    });
    // 等待免提
    text("免提").findOne(3000).click();
}

exports.openCall = function(phone_no){
    _openCall(phone_no);
}