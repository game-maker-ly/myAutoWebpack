// 需要无障碍权限

const KEY_CODE = {
    volume_up: 24,
    volume_down: 25,
    menu: 82,
    home: 3,
    back: 4
}
exports.KEY_CODE = KEY_CODE;

//启用按键监听

// 目前可监听
/*
keys.home 主页键
keys.back 返回键
keys.menu 菜单键
keys.volume_up 音量上键
keys.volume_down 音量下键
*/
// 仅在亮屏状态下生效，借助无障碍服务，但是无障碍息屏状态下是失效的
var isInit = false;
function _setClickListener(callback_Func) {
    if (isInit) return;
    // 阻碍之前的事件，脚本关闭会还原，也即按键屏蔽
    // home键和back键暂不屏蔽，后面看情况
    // 菜单键用于接听电话，拨打电话，
    // events.setKeyInterceptionEnabled("volume_up", true);
    // events.setKeyInterceptionEnabled("volume_down", true);
    // events.setKeyInterceptionEnabled("home", true);
    // events.setKeyInterceptionEnabled("back", true);
    events.setKeyInterceptionEnabled("menu", true);

    events.observeKey();
    // 当有按键被按下时会触发该事件
    // events.on("key_down", function (keyCode, event) {
    //     //处理按键事件
    //     // log("按键按下");
    //     // 这里只触发一次才对
    //     callback_Func && callback_Func(keyCode);
    // });
    // 菜单键按下触发
    //监听菜单键按下
    events.onKeyDown("menu", function (event) {
        log("菜单键按下");
        callback_Func && callback_Func();
    });

    events.on("exit", function () {
        //处理按键事件
        log("脚本退出");
    });

    // setTimeout(() => {
    //     exit();
    //     // 用于脚本保活，ui界面不需要
    // }, 5 * 3600 * 1000);
    isInit = true;
}

exports.setClickListener = function (callback_Func) {
    _setClickListener(callback_Func);
}

/*
events.observeKey();
//监听音量上键按下
events.onKeyDown("volume_up", function(event){
    toastLog("音量上键被按下了");
});

events.onKeyDown("volume_down", function(event){
    toastLog("音量下键被按下了");
});*/

