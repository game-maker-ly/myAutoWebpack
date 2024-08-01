
/**
 * 获取联系人
 * @return
 */
function getContactInfos() {
    var resolver = context.getContentResolver();
    var uri = app.parseUri("content://com.android.contacts/raw_contacts");
    var dataUri = app.parseUri("content://com.android.contacts/data");
    var contactInfos = [];
    var cursor = resolver.query(uri, ["contact_id"],
        null, null, null);
    while (cursor.moveToNext()) {
        var id = cursor.getString(0);
        if (id != null) {
            var info = {};
            var dataCursor = resolver.query(dataUri, ["mimetype", "data1"], "raw_contact_id=?",
                [id], null);
            while (dataCursor.moveToNext()) {
                if ("vnd.android.cursor.item/name".equals(dataCursor.getString(0))) {
                    info.name = dataCursor.getString(1);
                } else if ("vnd.android.cursor.item/phone_v2".equals(dataCursor.getString(0))) {
                    info.phone = dataCursor.getString(1);
                }
            }
            contactInfos.push(info);
            dataCursor.close();
        }
    }
    cursor.close();
    return contactInfos;
}


function selectContact() {
    // 打开选择联系人界面
    app.startActivity({
        action: "PICK",
        type: "vnd.android.cursor.dir/contact"
    });
}


// 根据姓名和电话，自动生成对应的拨号快捷方式在本地
// 引用一个基础的拨号模块
function _createContactShortcut(name, phone) {
    var script_str = '\
        app.startActivity({\
        action: "CALL",\
        flags: ["ACTIVITY_CLEAR_TASK", "ACTIVITY_NEW_TASK"],\
        data: "tel:"+'+phone+'\
    });\
    text("免提").findOne(10000).click();\
    ';
    var c_path = "shortcut/phone/"+name+".js";
    files.write(c_path, script_str);
}

// 这里就不是必要的了，反正生成js的步骤在本地
function _setContactInfo(name, phone) {
    var storage = storages.create("ly@123.com:contactinfo");
    log(name, phone);
    if (name) {
        storage.put(name, phone);
    }
}

function _getContactInfo_phone(name) {
    var storage = storages.create("ly@123.com:contactinfo");
    return storage.get(name);
}

// 不能用*号？，不符合逻辑
const white_list = ["罗", "唐", "黄", "红", "胡*全", "幺舅妈", "燕子", "五姐"];
const white_reg = new RegExp(white_list.join("|"));

function _initContactInfo() {
    // files.removeDir("shortcut");
    files.createWithDirs("shortcut/phone/");
    var c_infos = getContactInfos();
    // 这里可以过滤掉白名单以外的号码
    // 目前白名单暂定为
    // 但是部分号码读取有问题得修复一下（比如多个号码的，存储结构可能不一样
    for (let i = 0; i < c_infos.length; i++) {
        var c_name = c_infos[i].name;
        var c_phone = c_infos[i].phone;
        log(c_name, white_reg.test(c_name));
        // 白名单过滤
        if (c_name) {
            // _setContactInfo(c_infos[i].name, c_infos[i].phone);
            _createContactShortcut(c_name, c_phone);
        }
    }
}


// 幺舅妈，燕子，五姐，
// 罗*
// 唐*
// 黄*
// 胡*全
// 红*
_initContactInfo();

// log(_getContactInfo_phone("儿子"));

// 怎么存是个问题，
// 一种方法是直接用storage
// 另一种是存入txt，自己维护
// 能获取到了，剩下的就是持久化缓存，不用每次都去查询全部

