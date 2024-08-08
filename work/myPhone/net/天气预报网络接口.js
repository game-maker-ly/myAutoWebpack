let alarmUrl = "https://weather.cma.cn/api/map/alarm?adcode=43";
let weatherUrl = "https://weather.cma.cn/api/weather/57662";


function _getWeatherData() {
    // 少量请求用同步
    var res = http.get(weatherUrl);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        var daily = rejson.data.daily;
        var now = daily[0];
        var dayText = now.dayText;
        var nightText = now.nightText;
        var high = now.high;
        var low = now.low;
        return { "dayText": dayText, "nightText": nightText, "high": high, "low": low };
    }
    return null;
}

function _getAlarmData() {
    var res = http.get(alarmUrl);
    if (res.statusCode == 200) {
        var rejson = res.body.json();
        for (let i = 0; i < rejson.data.length; i++) {
            var description = rejson.data[i].description;
            if (description.indexOf("鼎城") != -1) {
                return description;
            }
        }
    }
    return null;
}


function _getSpeakerString() {
    var nowData = _getWeatherData();
    var alarmData = _getAlarmData();
    if (nowData) {
        //
        var str = "今天天气是";
        str += nowData.dayText;
        str += "，最高气温" + nowData.high + "度";
        str += "，最低气温" + nowData.low + "度";
        if (nowData.nightText.indexOf("雨") != -1) {
            str += "，晚上可能会有" + nowData.nightText;
        }
        if (alarmData) {
            var idx = alarmData.indexOf("今天");
            if (idx == -1) idx = alarmData.indexOf("预计");
            str += "。" + alarmData.substring(idx);
        }
        return str;
    }
    return null;
}

// 息屏无法访问网络
// 依赖亮屏，以及数据接口开关
// log(_getSpeakerString());

exports.getSpeakerString = function () {
    return _getSpeakerString();
}
