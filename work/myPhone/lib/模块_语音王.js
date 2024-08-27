importClass(java.util.Locale);
importClass(android.speech.tts.TextToSpeech);
importClass(android.speech.tts.TextToSpeech.Engine);
importClass(android.speech.tts.TextToSpeech.OnInitListener);
importClass(android.speech.tts.UtteranceProgressListener);

// getVoice,getVoices,getDefaultVoice，都返回null，当前引擎不支持切换音色
// 流出修改接口就行
//getEngines,获取到小爱引擎

// 获取时间，仅时分用于播报
// 整点报时
function _getSpeakerTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    // var second = now.getSeconds();
    var isAm = hour < 13;
    var resStr = "";
    if (isAm) {
        if (hour < 9) {
            resStr = "早上";
        } else {
            resStr = "上午";
        }
    } else {
        if (hour > 18) {
            resStr = "晚上";
        } else {
            resStr = "下午";
        }
        hour -= 12;
    }
    var minute_addstr = "";
    if (minute == 0) {
        minute_addstr = "整";
    } else if (minute < 10) {
        minute_addstr = "0" + minute + "分";
    } else {
        minute_addstr = minute + "分";
    }
    resStr += hour + "点" + minute_addstr;
    return resStr;
}


// 简单来说在java的回调代码里面操作线程，是不受autojs控制的
// 多线程的bug，说到底没有提供强制结束的方法
// 导致子线程一直阻塞，无法释放
// 需要手动exit() ,此时shutdown也没用

// 最大音量
// const MAX_VOLUME = device.getMusicMaxVolume();
// 生命周期以脚本为单位，脚本运行则创建，脚本退出则销毁
// 和广播的思路一致
var tts;
// 仅初始化一次
var isInit = false;
// 线程锁保证同步
var t_lock_flag = false;

function _init() {
    if (isInit) return;
    isInit = true;
    // 音高
    var pitch = 1.0;
    // 语速
    var speechRate = 1.0;
    // 初始化tts引擎
    tts = new TextToSpeech(context, TextToSpeech.OnInitListener({
        onInit: function (status) {
            if (status == TextToSpeech.SUCCESS) {
                if (tts.setLanguage(Locale.CHINESE) == TextToSpeech.SUCCESS && tts.setPitch(pitch) == TextToSpeech.SUCCESS && tts.setSpeechRate(speechRate) == TextToSpeech.SUCCESS) {
                    log("初始化tts成功！");
                } else {
                    log("tts初始化找不到对应设置的语音包");
                    // exit();
                }
            } else {
                log("初始化tts失败");
            }
        }
    }));
    // 添加进度监听
    // onstart，开始，onDone，结束，onError，错误
    // 还是老样子，异步变同步
    // 用事件延时很高
    // 直接线程锁得了
    // log(tts.getDefaultVoice());
    tts.setOnUtteranceProgressListener(new JavaAdapter(UtteranceProgressListener, {
        onStart: function () {
            log("开始播报");
            // 线程阻塞
            // 会导致主线程无法结束
            // 不能在回调方法里这样搞
        },
        onDone: function () {
            log("播报完毕");
            // 释放阻塞线程
            t_lock_flag = false;
        }
    }));

    // 注册销毁，释放引擎
    events.on("exit", function () {
        if (tts != null) {
            log("释放tts引擎");
            tts.stop();
            tts.shutdown();
            tts = null;
        }
    });
}

// 可以修改默认引擎，但是无法指定发音人
function _speak(str) {
    // 尝试初始化
    _init();
    // 获取当前音量
    // let old = device.getMusicVolume();
    // 设置最大音量
    // device.setMusicVolume(MAX_VOLUME);
    // 播报内容，返回0/1，失败/成功，
    // 添加到队列
    // 等待读文字完毕
    t_lock_flag = true;
    // 这里使用join阻塞主线程
    // 通过布尔值控制线程结束与否
    // 不能使用中断机制，中断会导致子线程无法正确结束
    // 阻塞主线程，使异步代码变为同步代码
    // 但不适用与异步下载的情况
    // 之前用interval的方式，会导致子线程无法结束
    // 对线程的操作不能放到java的回调里面，否则就会出无法结束的bug
    // 最好还是用布尔值的方式，官方文档里面推荐的方式
    var t_lock = threads.start(function () {
        // 播报语音不能放在主线程，否则会被阻塞
        tts.speak(str, TextToSpeech.QUEUE_ADD, null, "mySpeakId");
        while (t_lock_flag) { }
    });
    // t_lock.waitFor();
    t_lock.join();
    // 恢复音量
    // device.setMusicVolume(old);
}


exports.speak = function (str) {
    _speak(str);
}

exports.getSpeakerTime = function () {
    return _getSpeakerTime();
}
