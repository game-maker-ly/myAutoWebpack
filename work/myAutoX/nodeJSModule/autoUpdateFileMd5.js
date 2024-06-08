// 遍历工程目录下，非黑名单中的所有文件
// 然后计算md5值并保存到md5.json
// 手动执行的话用遍历all
// 否则就用白名单模式，传入推送的文件,只更新这部分文件的md5
const ftool = require('./fileTool.js');
const md5tool = require('./md5tool.js');
// 一定会更新的文件不需要记录md5值
var blackFileList = ["main.js","project.json","md5.json","tasker/按需更新文件.js"]
var blackDirList = ["app", "lib", "net", "nodeJSModule"]
// 得带参数来执行
async function calFilesMd5AndSave(desDir){
    console.log("计算md5值");
    var allFiles = await ftool.listFiles(desDir);
    // 通过正则来匹配，如果符合就排除
    var md5_json = {}
    var blackReg = new RegExp(blackDirList.join("|"));
    allFiles.forEach(path => {
        // console.log(path);
        var path_f = ftool.getRelativePath(path);
        if(blackReg.test(path_f) || blackFileList.includes(path_f)){return;}
        var md5val= md5tool.getMd5(path);
        md5_json[path_f] = md5val;
    });
    var str = JSON.stringify(md5_json);
    ftool.saveMd5Json(str);
    // console.log(md5val);
}

// 计算发布文件下的md5
calFilesMd5AndSave("../../../dist/myAutoX");
// 计算工程文件下的md5
// calFilesMd5AndSave("../");