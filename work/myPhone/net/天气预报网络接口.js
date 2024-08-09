const okHttpTool = require("../lib/模块_okHttp重写.js");
// 强制使用ipv4访问，仅在当前脚本生命周期内生效
okHttpTool.forceUseIpv4();

// 鼎城区告警url，数字缩短一位意味着范围扩大
let alarmUrl = "https://weather.cma.cn/api/alarm?adcode=430703";
let weatherUrl = "https://weather.cma.cn/api/weather/57662";
let nowUrl = "https://weather.cma.cn/api/now/57662";

function _getNowData() {
    var res = http.get(nowUrl);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        var now = rejson.data.now;
        return now;
    }
    return null;
}

function _getWeatherData() {
    // 少量请求用同步
    var res = http.get(weatherUrl);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        var daily = rejson.data.daily;
        var now = daily[0];
        var weatherData = { "now": daily[0], "next": daily[1] };
        return weatherData;
    }
    return null;
}

function _getAlarmData() {
    var res = http.get(alarmUrl);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        if (rejson.data.length > 0) {
            return rejson.data[0].description;
        }
    }
    return null;
}

const WEATHER_TYPE = {
    now_only: 0,
    next_only: 1,
    now_and_next: 2
}

function _getSpeakerString(weather_type, isIgnoreTemp, isIgnoreAlarm) {
    var weatherData = _getWeatherData();
    var nowData = weatherData.now;
    var nextData = weatherData.next;
    // 如果获取不到，说明网络不通或者接口出错
    if (!weatherData) return null;
    var str = "";
    if (!isIgnoreAlarm) {
        var cur_temperature = _getNowData().temperature;
        str += "当前气温是：" + cur_temperature + "度。";
    }
    var now_str = "今天天气是";
    if (nowData.dayText != nowData.nightText) {
        now_str += nowData.dayText + "转" + nowData.nightText;
    } else {
        now_str += nowData.dayText;
    }
    now_str += "，最高气温" + nowData.high + "度";
    now_str += "，最低气温" + nowData.low + "度。";
    var next_str = "明天天气是";
    if (nextData.dayText != nextData.nightText) {
        next_str += nextData.dayText + "转" + nextData.nightText;
    } else {
        next_str += nextData.dayText;
    }
    next_str += "，最高气温" + nextData.high + "度";
    next_str += "，最低气温" + nextData.low + "度。";
    if (weather_type == WEATHER_TYPE.now_only) {
        str += now_str;
    } else if (weather_type == WEATHER_TYPE.next_only) {
        str += next_str;
    } else {
        str += now_str + next_str;
    }
    if (!isIgnoreAlarm) {
        var alarmData = _getAlarmData();
        // 告警直接放在最后即可
        if (alarmData) {
            var idx = alarmData.indexOf("今天");
            if (idx == -1) idx = alarmData.indexOf("预计");
            str += alarmData.substring(idx);
        }
    }
    // 返回播报字符串
    return str;
}

// 息屏无法访问网络
// 依赖亮屏，以及数据接口开关
// log(_getSpeakerString());

exports.getSpeakerString = function (weather_type, isIgnoreTemp, isIgnoreAlarm) {
    return _getSpeakerString(weather_type, isIgnoreTemp, isIgnoreAlarm);
}
