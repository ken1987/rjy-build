/*
 * 微信登录
 * @require /utils/utils.js
 * @require /configs/configs.js
 */
(function (window) {
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var urlParse = utils.urlParse;
    var store = utils.store;
    var search = urlParse().search;

    //获取缓存数据
    var state = search.state;
    var localData = store.get(state);
    var ref = localData.ref;
    store.remove(state);

    xhr({
        url: "{student}/login/weixin",
        data: {
            code: search.code //微信授权码
        },
        success: function () {
            location.href = window.decodeURIComponent(ref || '/'); //回调地址 ;
        },
        error: function () {
            var url = localData.loginUrl;
            location.href = url + (/\?/.test(url) ? '&' : "?") +"ref="+ ref;
        }
    });
} (window));
