/*
 * 获取微信的网页授权
 * 参考文档：http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
 * @require /configs/configs.js
 * @require _.js
 */
window.RUtils.getWeChatCode = function(redirect_uri, status) {
    location.href =
        'https://open.weixin.qq.com/connect/oauth2/authorize' +
        '?appid=' + window.RConfigs.wechatAppid + //微信唯一授权码
        '&redirect_uri=' + window.encodeURIComponent(redirect_uri) + //重定向地址
        '&response_type=code' +
        '&scope=snsapi_base' + //授权类型 snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
        '&state=' + (typeof status != 'undefined' ? status : "") +
        '#wechat_redirect';
};
