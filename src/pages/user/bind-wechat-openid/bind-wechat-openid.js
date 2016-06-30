/*
 * 微信中转页面
 * 支持微信登录和微信绑定
 * @require /utils/utils.js
 */
(function(window) {
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var store = utils.store;
    var urlParse = utils.urlParse;
    var search = urlParse().search;

    //获取缓存数据
    var state = search.state;
    var ref = store.get(state);
    store.remove(state);

    //获取openid
    xhr({
        url: "{student}/weixin/bind",
        data: {
            code: search.code //微信授权码
        }
    });

    //不管成功失败，直接重定向
    location.href = ref;
}(window));

