/*
 * 微信支付
 * 参考资料：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 * @require "/utils/utils.js"
 * @require "/configs/configs.js"
 */
(function (window) {
    var wx = window.wx; //微信sdk
    var utils = window.RUtils;
    var configs = window.RConfigs;
    var xhr = utils.xhr;
    var store = utils.store;
    var search = utils.urlParse().search;
    var openId = '';
    var uid = search.state;
    var options = store.get(uid);
    var successUrl = options.successUrl; //支付成功页面
    store.remove(uid);
    //支付成功
    function payError(a, msg) {
        alert('支付失败');
        // alert(msg)
        // location.href = errorUrl;
    }

    //支付失败
    function paySuccess() {
        // alert('支付成功')
        location.href = successUrl; //免单直接跳转
    }

    //支付
    function pay() {
        var data = {
            wxcode: search.code,
            orderId: options.orderId,
            thirdPayType: configs.payType.WEIXIN,
            returnUrl: successUrl
        };
        //如果优惠券不存在，不能乱传，后台判断有问题
        if (options.couponId) {
            data.couponId = options.couponId;
        }
        xhr({
            url: "{student}/order/pay",
            type: 'post',
            data: data,
            success: function (data) {
                // alert('已经发送支付请求')
                if (data.freeOrder) {
                    paySuccess();
                } else {
                    var d = data.payParams;
                    wx.chooseWXPay({
                        timestamp: d.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: d.nonceStr, // 支付签名随机串，不长于 32 位
                        package: d.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: d.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: d.paySign, // 支付签名
                        success: paySuccess
                    });
                }
            },
            error: payError
        });
    }
    //微信js-sdk签名请求
    xhr({
        url: "{student}/weixin/signjsapi",
        data: {
            url: location.origin
        },
        success: function (data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appid, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.noncestr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            wx.ready(pay);

            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            wx.error(function (res) {
                // alert(res);
            });
        },
        error: function (data) {
            // alert('获取微信js-sdk签名请求失败!');
        }
    });
} (window));
