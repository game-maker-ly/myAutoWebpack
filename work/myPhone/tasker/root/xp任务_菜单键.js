try {
    // 目前的情况，
    // 来电接听
    // 电话本拨号
    // 拨号界面拨号
    // 挂断（电源键，暂不考虑
    // 拨号键
    var sim_dial_btn = id("com.android.contacts:id/sim_dial_btn").findOnce();
    sim_dial_btn && sim_dial_btn.click();
    // 联系人电话
    var contact_data = id("com.android.contacts:id/data").findOnce();
    contact_data && contact_data.parent().parent().click();
    // 接听电话
    var unlock_answer = id("com.android.incallui:id/unlock_answer").findOnce();
    unlock_answer && unlock_answer.click();
} catch (error) { }

