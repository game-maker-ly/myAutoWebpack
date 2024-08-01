importClass(android.os.Build);
importClass(android.media.AudioManager);


var audioManager;
function init( ) {
    audioManager = context.getSystemService(context.AUDIO_SERVICE);
}
/**
 * 设置播放模式
 */
function setAudioStreamType(speaker) {
    if (speaker) {
        audioManager.setSpeakerphoneOn(true);
        audioManager.setMode(AudioManager.MODE_IN_CALL);
        //设置音量，解决有些机型切换后没声音或者声音突然变大的问题
        audioManager.setStreamVolume(AudioManager.STREAM_SYSTEM,
                audioManager.getStreamVolume(AudioManager.STREAM_SYSTEM), AudioManager.FX_KEY_CLICK);
    } else {
        audioManager.setSpeakerphoneOn(false);//关闭扬声器
        //5.0以上
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            //设置音量，解决有些机型切换后没声音或者声音突然变大的问题
            audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL,
                    audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL), AudioManager.FX_KEY_CLICK);
        } else {
            audioManager.setMode(AudioManager.MODE_IN_CALL);
            audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL,
                    audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL), AudioManager.FX_KEY_CLICK);
        }
    }
}

// 对oppo手机无效
// 试一下miui能否生效

// 实在不行就直接用无障碍点击得了
// text("免提").findOne(1000).click();果然还得大道至简，用这个就得了

// b无障碍还要提示，果然还得root

// 鸡肋，需要调整音量权限（安卓7以上还额外需要勿扰权限，但是不如无障碍来的简单
// 这个不一定有效，至少通话界面无效，并且还需要手动还原

// 有用，但是扬声器效果影响到看视频了，不太友好

// 退出autojs可以还原

init();
setAudioStreamType(true);
