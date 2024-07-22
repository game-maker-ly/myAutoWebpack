
var window=null;
// _createBtn2click(true);

function _createBtn2click(isDragable, callback_Func){
    window = floaty.window(
        <frame gravity="center" id="content">
             <img src="file://icon/选集.png" id="action" w="70" h="70"/>
        </frame>
    );

    log("创建悬浮窗按钮");

    // 根据屏幕朝向，修改按钮坐标
    // window.setPosition(100, 700);
    var angle = _getScreenRotation();
    var isLandscape = angle == 1 || angle == 3;
    _setBtnPos(isLandscape);
    // 自动隐藏
    setAutoHide();

    // 事件有概率阻塞脚本
    setTimeout(()=>{
        window.close();
        exit();
    }, 5 * 3600 * 1000);

    // 注册点击广播
    _registerClickBroadcast(isDragable, callback_Func);
    
}

// 图片也可以触发点击事件
// 那就没必要一定用按钮，毕竟样式太少，字体不好看
// 用透明png图片即可，
// 所以没区别
// 可以使用这种方式修改src
// 不过不建议代码存base64，可读性很差
// 要存也该用个公用的全局js存
// window.action.attr("src", base_STR);
// xml部分也可以用{}来填充变量
// 默认抖音靠左，需要判断当前屏幕方向
// 然后设置靠左垂直居中




//记录按键被按下时的触摸坐标
var x = 0, y = 0;
//记录按键被按下时的悬浮窗位置
var windowX, windowY;
//记录按键被按下的时间以便判断长按等动作
var downTime;
function _addTouchEvent(){
    window.action.setOnTouchListener(function(view, event){
        switch(event.getAction()){
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                downTime = new Date().getTime();
                return true;
            case event.ACTION_MOVE:
                //移动手指时调整悬浮窗位置
                window.setPosition(windowX + (event.getRawX() - x),
                    windowY + (event.getRawY() - y));
                //如果按下的时间超过1.5秒判断为长按，退出脚本
                if(new Date().getTime() - downTime > 1500){
                    exit();
                }
                return true;
            case event.ACTION_UP:
                //手指弹起时如果偏移很小则判断为点击
                if(Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5){
                    onClick();
                }
                return true;
        }
        return true;
    });
}


var cacheWindowManager = null;
// 0,1,2,3，分别是竖屏，横屏，反转竖屏，反转横屏
function _getScreenRotation() {
    if (cacheWindowManager == null) {
        cacheWindowManager = context.getSystemService(context.WINDOW_SERVICE);
    }
    return cacheWindowManager.defaultDisplay.rotation;
}



function _registerClickBroadcast(isDragable, callback_Func){
    // 可拖拽改变位置
    if(isDragable){
        // 不需要java包装，可以直接用touch监听
        _addTouchEvent();
    }else{
        window.action.click(function(){
            onClick();
        });
    }
    events.broadcast.on("onMyBtnClick", function () {
        callback_Func && callback_Func();
    });
}


function onClick(){
    toastLog("触发点击");
    setAutoHide();
    events.broadcast.emit("onMyBtnClick");
    // 用广播通知上层，懒得回调了
}

// 理论上用面向对象的方式更好重构
// 但现在先跑起来再说
function _setBtnPos(isLandscape){
    if(!window) return;
    if(isLandscape){
        window.setPosition(0, (device.width - 100) / 2);
    }else{
        window.setPosition(0, (device.height - 100) / 2);
    }
}

// 3s后隐藏
// 考虑到抖音白色较为显眼，就白底黑字
function setAutoHide(){
    window.content.attr("alpha", 1);
    setTimeout(()=>{
        window.content.attr("alpha", 0.3);
    }, 3000);
}

// 问题在于怎么兼容，这么多东西写在一个脚本里很容易弄混
// 要不新建一个得了
// 目前只有创建按钮，刷新位置和设置点击事件需要暴露出去
// 点击事件肯定是创建时就赋值
// 刷新位置交给上层
exports.createBtn2clickAddon = function(isDragable, callback_Func){
    _createBtn2click(isDragable, callback_Func);
}


exports.setBtnPos = function(isLandscape){
    _setBtnPos(isLandscape);
}
