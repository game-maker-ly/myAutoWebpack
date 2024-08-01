// 目前用于通知桌面进行备份

function restoreNovaDesktop_private(){
    var isSucc = app.startActivity({
        packageName: "com.teslacoilsw.launcher", 
        className: "com.teslacoilsw.launcher.RestoreBackupFileHandler",
        data: "file:///storage/emulated/0/Android/长辈模式.novabackup"
    });
}
// 安卓10以上需要手动授权访问所有文件权限，否则就是在沙盒里访问
// 无法获取真实路径下的文件
// restoreNovaDesktop_private();

exports.restoreNovaDesktop = function(){
    restoreNovaDesktop_private();
}