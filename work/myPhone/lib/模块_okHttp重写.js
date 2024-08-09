// let a = http.client;
importClass(java.net.InetAddress);
importClass(java.net.Inet4Address);

// 通过修改域名解析的ipv4和ipv6地址优先级来实现ipv4优先访问
function _forceUseIpv4() {
    // 自定义dns和okhttp的client来强制ipv4访问
    let myDns = new JavaAdapter(Dns, {
        lookup: function (hostname) {
            if (!hostname) {
                // host为空
                return Dns.SYSTEM.lookup(hostname);
            } else {
                try {
                    let inetAddressList = [];
                    //获取所有IP地址
                    let inetAddresses = InetAddress.getAllByName(hostname);
                    //遍历这里面所有的地址，哪些式IPV4的
                    for (let i = 0; i < inetAddresses.length; i++) {
                        let inetAddress = inetAddresses[i];
                        // log(inetAddress);
                        if (inetAddress instanceof Inet4Address) {
                            // ipv4地址放入数组开头
                            inetAddressList.unshift(inetAddress);
                        } else {
                            inetAddressList.push(inetAddress);
                        }
                    }
                    return inetAddressList;
                } catch (e) {
                    return Dns.SYSTEM.lookup(hostname);
                }
            }
        }
    });
    // 使用自定义dns编译生成okhttpClient
    let b = new OkHttpClient.Builder().dns(myDns).build();
    // 覆盖http请求的client
    http.client = function () {
        return b;
    };
}


exports.forceUseIpv4 = function(){
    _forceUseIpv4();
}