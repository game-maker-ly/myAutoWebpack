importClass(android.speech.tts.TextToSpeech.Engine);
importClass(java.util.Locale);
importClass(android.speech.tts.TextToSpeech)
importClass(android.speech.tts.TextToSpeech.OnInitListener)

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
        resStr = "上午";
    } else {
        resStr = "下午";
        hour -= 12;
    }
    var minute_addstr = "";
    if(minute == 0){
        minute_addstr = "整";
    }else if(minute < 10){
        minute_addstr = "0"+minute+"分";
    }else{
        minute_addstr = minute+"分";
    }
    resStr += hour + "点" + minute_addstr;
    return resStr;
}


function _speak(str) {
    // 获取当前音量
    let old = device.getMusicVolume();
    // 设置最大音量
    device.setMusicVolume(15);
    // 播报内容
    // var str = "现在是北京时间，" + speakerTime();
    var pitch = 1.0;
    var speechRate = 1.0;
    var obj = {
        onInit: function (status) {
            if (status == TextToSpeech.SUCCESS) {
                if (tts.setLanguage(Locale.CHINESE) == TextToSpeech.SUCCESS && tts.setPitch(pitch) == TextToSpeech.SUCCESS && tts.setSpeechRate(speechRate) == TextToSpeech.SUCCESS) {
                } else {
                    exit()
                }
            } else { }
        }
    };
    tts = new TextToSpeech(context, TextToSpeech.OnInitListener(obj));
    // 等待合成完毕
    sleep(1000);
    var a = tts.speak(str, TextToSpeech.QUEUE_ADD, null);
    // 等待读文字完毕
    sleep(10000);
    // 恢复音量
    device.setMusicVolume(old);
}

exports.speak = function(str){
    _speak(str);
}

exports.getSpeakerTime = function(){
    return _getSpeakerTime();
}
