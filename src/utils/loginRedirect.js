/*
 * 登录重定向
 * @require /configs/configs.js
 * @require _.js
 * @require device.js
 * @require getWeChatCode.js
 * @require store.js
 */
(function(window) {
    var utils = window.RUtils;
    var store = utils.store;
    var isWechat = utils.device.isWeChat; //是否是微信
    var getWeChatCode = utils.getWeChatCode; //获取微信用户授权码
    var wechatLoginUrl = location.origin+__uri('/pages/user/login-wechat/login-wechat.html'); //微信登录页
    /**
     * 登录重定向
     * @param  {string} ref      重定向网址，默认是当前网址
     * @param  {string} loginUrl 非微信登录地址
     */
    utils.loginRedirect = function(ref, loginUrl) {
        ref = ref || location.href;
        //微信登录
        if (isWechat) {
            var uid = "wechatLogin" + (+new Date());
            store.set(uid, {
                ref: encodeURIComponent(ref), 
                loginUrl: loginUrl
            });
            getWeChatCode(wechatLoginUrl, uid);
        } else if (loginUrl) {
            if (ref) {
                loginUrl += "?ref=" + encodeURIComponent(ref);
            }
            window.location.href = loginUrl;
        }
    };
}(this));
