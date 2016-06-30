/*
 * 下载重定向
 * @require _.js
 * @require device.js
 */
(function(window) {
    var utils = window.RUtils;
    var device = utils.device;
    var isIOS = device.isIOS;
    var isWeChat = device.isWeChat;
    var isQQ = device.isQQ;

    utils.downloadAppRedirect = function(update) {
        var u = window.navigator.userAgent;
        var url; //跳转链接
        //应用宝链接
        var yybUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zjcs.student&g_f=991653';

        //尝试唤起app
        if (isWeChat || isQQ) {
            url = yybUrl; //如果是微信 / QQ浏览器，转到应用宝
        } else if(update){
            
            url = isIOS ? '//itunes.apple.com/cn/app/run-jiao-yu/id1026372809?l=en&mt=8' : yybUrl;

        } else {
            url = isIOS ? "com.szzjcs.RunEduUser://mode=show&&id=" + status.id : "runedu://student.com?mode=show&&id=" + status.id;
        }

        //重定向
        location.href = url;

        //如果重定向失败，跳转到对应下载页面
        var t = new Date();
        setTimeout(function() {
            t = new Date() - t;
            if (t < 2000 + 1000) {
                location.href = isIOS ?
                    '//itunes.apple.com/cn/app/run-jiao-yu/id1026372809?l=en&mt=8' :
                    yybUrl;
            }
        }, 2000);
    };
}(this));
