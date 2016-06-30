/*
 * 设备检测
 * @require _.js
 */
(function(window) {
    var userAgent = navigator.userAgent;
    var isWeChat = /MicroMessenger/i.test(userAgent);
    var isQQ = userAgent.match(/QQ/i) !== null; //QQ 全部浏览器(QQ浏览器 和 QQ内置浏览器)
    var isMQQBrowser = userAgent.indexOf('MQQBrowser') > -1; // 判断为QQ 浏览器
    var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;
    var isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var isRUNEDU =  userAgent.indexOf('RUNEDU') >-1; 
    
    window.RUtils.device = {
        isWeChat: isWeChat,          //是否是微信
        isQQ: isQQ,
        isIOS: isIOS,                   
        isAndroid: isAndroid,
        isRUNEDU: isRUNEDU,          //是否为润教育APP 打开
        isMQQBrowser: isMQQBrowser   //是否为QQ 浏览器  
    };

}(this));
