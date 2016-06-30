/*
 * 绑定微信用户openId
 * @require _.js
 * @require getWeChatCode.js
 * @require store.js
 */
(function(window) {
    var utils = window.RUtils;
    var store = utils.store;
    var getWeChatCode = utils.getWeChatCode; //获取微信用户授权码
    var wechatLoginUrl = location.origin + __uri('/pages/user/bind-wechat-openid/bind-wechat-openid.html'); //微信登录页
    
    /**
     * 绑定微信用户openId
     * @param  {string} ref 重定向网址
     */

    utils.bindWeChatOpenId = function(ref) {
        var uid = "bindWeChatOpenId" + (+new Date());
        store.set(uid, ref);
        getWeChatCode(wechatLoginUrl, uid);
    };
}(this));
