// 拖拽事件类
function MyDragEvent() {
    //记录按键被按下时的触摸坐标
    this.x = 0;
    this.y = 0;
    //记录按键被按下时的悬浮窗位置
    this.windowX = 0;
    this.windowY = 0;
    //记录按键被按下的时间以便判断长按等动作
    this.downTime = 0;
}
MyDragEvent.prototype.addDragEvent = function (window, callback_Func) {
    var tmpThis = this;
    window.action.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                tmpThis.x = event.getRawX();
                tmpThis.y = event.getRawY();
                tmpThis.windowX = window.getX();
                tmpThis.windowY = window.getY();
                tmpThis.downTime = new Date().getTime();
                return true;
            case event.ACTION_MOVE:
                //移动手指时调整悬浮窗位置
                window.setPosition(tmpThis.windowX + (event.getRawX() - tmpThis.x),
                tmpThis.windowY + (event.getRawY() - tmpThis.y));
                //如果按下的时间超过1.5秒判断为长按，退出脚本
                /*if (new Date().getTime() - this.downTime > 1500) {
                    exit();
                }*/
                return true;
            case event.ACTION_UP:
                //手指弹起时如果偏移很小则判断为点击
                if (Math.abs(event.getRawY() -tmpThis.y) < 5 && Math.abs(event.getRawX() - tmpThis.x) < 5) {
                    callback_Func && callback_Func();
                }
                return true;
        }
        return true;
    });
}
// 悬浮窗按钮类
function MyFloatyBtn(id, img_path, btn_size) {
    this.id = id;
    this.img_path = img_path;
    this.btn_size = btn_size;
    this.event;

    log("类：创建悬浮窗按钮对象，按钮大小："+btn_size);

    this.window = floaty.window(
        <frame gravity="center" id="content">
            <img id="action"/>
        </frame>
    );

    // 修改图片SRC
    this.window.action.attr("src", img_path);
    // 修改图片大小
    this.window.action.attr("w", btn_size);
    this.window.action.attr("h", btn_size);

    // 自动隐藏
    this.autoHide();
    // 延时关闭
    setTimeout(() => {
        this.window.close();
        exit();
    }, 5 * 3600 * 1000);
}
MyFloatyBtn.prototype.desc = "悬浮窗按钮类";
MyFloatyBtn.prototype.autoHide = function () {
    // log("自动隐藏当前按钮");
    this.window.content.attr("alpha", 1);
    setTimeout(() => {
        this.window.content.attr("alpha", 0.3);
    }, 3000);
}
MyFloatyBtn.prototype.setPos = function (x, y) {
    // log("设置按钮位置"+x+ ":"+ y);
    this.window.setPosition(x, y);
}
MyFloatyBtn.prototype.show = function (isShow) {
    // 这里需要用ui线程更新可视化
    var tmpThis = this;
    if (isShow) {
        ui.run(function () {
            tmpThis.window.content.attr("visibility", "visible");
        });
        // 延迟隐藏
        this.autoHide();
    } else {
        ui.run(function () {
            tmpThis.window.content.attr("visibility", "gone");
        });
    }
}
MyFloatyBtn.prototype.setOnClickListener = function (isDragable, callback_Func) {
    var tmpThis = this;
    let clickFunc = function(){
        // 这里是处于Ui线程，做无障碍操作会卡死
        // 新开一个线程执行回调
        // 隐藏按钮
        tmpThis.autoHide(); // 触发点击自动3s后隐藏
        // 事件通知可以规避递归死循环，
        // 但是延时很大并且不稳定
        // 对于即时性要求高的操作，需要用线程替代
        // 事件好处是方便多个文件之间调用
        // 坏处也在此，代码容易高耦合，你调用我，我调用你
        // 尽量减少不同文件之间的事件通知
        // 这里可以用线程+回调，
        // 事件写法反而复杂了
        // 本身事件通知的好处之一是减少回调，
        // 但涉及到回调的地方就可以避免用事件
        // 譬如设置监听的操作，一般都是用回调
        threads.start(function(){
            callback_Func && callback_Func();
        });
        // events.broadcast.emit("onMy2SideBtnClick", tmpThis.id);
    }
    if(isDragable){
        this.event = new MyDragEvent();
        this.event.addDragEvent(this.window, clickFunc);
    }else{
        this.window.action.click(clickFunc);
    }
}


exports.MyFloatyBtn = MyFloatyBtn;