function searchWithType_private(keyword, type){
    var videoUrl = util.format("snssdk1128://search?keyword=%s&type=%s", keyword, type);
    app.startActivity({
        action: "VIEW",
        data: videoUrl
    });
}


exports.searchWithType = function(keyword, type){
    searchWithType_private(keyword, type);
    sleep(5000);
    click(300, 500);
}

