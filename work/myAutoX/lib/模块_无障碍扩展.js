//长距离测试
//sml_move(400, 1800, 400, 0, 300);
//短距离测试
//sml_move(400, 1000, 800, 600, 1000);
swipe(500, 1800, 500, 0, 500);
//此代码由飞云脚本圈整理提供（www.feiyunjs.com）
function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x); 
    bx = 3.0 * (cp[2].x - cp[1].x) - cx; 
    ax = cp[3].x - cp[0].x - cx - bx; 
    cy = 3.0 * (cp[1].y - cp[0].y); 
    by = 3.0 * (cp[2].y - cp[1].y) - cy; 
    ay = cp[3].y - cp[0].y - cy - by; 
    
    tSquared = t * t; 
    tCubed = tSquared * t; 
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x; 
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y; 
    return result; 
};

//仿真随机带曲线滑动  
//qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
function sml_move(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };

    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy , qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy , zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {

        eval("point.push(dx" + i + ")");

    };
    log(point[3].x)

    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]

        xxy.push(xxyy);

    }

    log(xxy);
    gesture.apply(null, xxy);
};
