var a = context.getSystemService(context.POWER_SERVICE);
var b= a.class;
var c=b.getMethod("isPowerSaveMode");

log(c);
log(c.invoke(a));


// 安卓原生并不支持
// 已知：不支持代码切换省电模式
// 不支持创建快捷方式去除角标
// 不支持移动数据切换
// 这些估计得找厂商或launcher的后门
