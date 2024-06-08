// 目前用于通知桌面进行备份

// var isSucc = app.startActivity({
//     packageName: "com.teslacoilsw.launcher", 
//     className: "com.teslacoilsw.launcher.RestoreBackupFileHandler",
//     data: "file:///storage/emulated/0/data/com.teslacoilsw.launcher/backup/长辈模式.novabackup"
// });
// 以及还原备份
exports.restoreNovaDesktop = function(){
    var isSucc = app.startActivity({
        packageName: "com.teslacoilsw.launcher", 
        className: "com.teslacoilsw.launcher.RestoreBackupFileHandler",
        data: "file:///storage/emulated/0/data/com.teslacoilsw.launcher/backup/长辈模式.novabackup"
    });
}