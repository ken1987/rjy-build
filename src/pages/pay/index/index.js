/*
 * 课程支付
 * @require '/libs/vue.js'
 * @require '/libs/big.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 * @require "/configs/configs.js"
 */
(function (window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var Big = window.Big;
    var utils = window.RUtils;
    var getWeChatCode = utils.getWeChatCode;
    var configs = window.RConfigs;
    var xhr = utils.xhr;
    var store = utils.store;
    var successUrl = location.origin + __uri('../pay-success/pay-success.html'); //支付成功页面
    var wx = window.wx; //微信sdk
    var orderId = utils.urlParse().search.id; //订单id
    var modal = UI.modal;
    var payZhifubao = (function () {
        //支付宝支付
        var redirect = function (data) {
            var encodeURIComponent = window.encodeURIComponent;
            var params = data.params;
            var param = '';
            for (var a in params) {
                param += '&' + a + '=' + encodeURIComponent(params[a]);
            }
            location.href = data.alipayGateway + '?' + param.substr(1);
        };

        return function (orderId, couponId, successUrl) {
            xhr({
                url: "{student}/order/pay",
                type: 'post',
                data: {
                    thirdPayType: configs.payType.ZHIFUBAO,
                    orderId: orderId,
                    couponId: couponId,
                    returnUrl: successUrl
                },
                success: function (data) {
                    if (data.freeOrder) {
                        location.href = successUrl; //免单直接跳转到成功页面
                    } else {
                        redirect(data.payParams); //第三方支付
                    }
                },
                error: function (data, msg) {
                    modal.alert({
                        title: msg || '支付失败'
                    });
                }
            });
        };
    } ());

    var payType = window.RConfigs.payType;

    //状态
    var status = {
        isInit: true, //是否正在初始化
        info: {}, //课程详情
        luckyCode: '', //抽奖码
        isLuckyGoing: false, //正在抽奖
        isShowCoupons: false, //是否显示优惠券
        selectedCoupons: null, //已选中的优惠券对象
        thirdPayType: configs.payType.ZHIFUBAO, //第三方支付方式，默认支付宝
        types: [],    // 第三方支付类型数据
    };

    //如果不在微信里面，过滤微信支付
    if (window.RUtils.device.isWeChat) {
        status.types.push({
            name: '微信',
            type: payType.WEIXIN
        });
        status.thirdPayType = configs.payType.WEIXIN;
    } else {
        status.types.push({
            name: '支付宝',
            type: payType.ZHIFUBAO
        });
        status.thirdPayType = configs.payType.ZHIFUBAO;
    }

    var actions = {
        getDefaultGroupImg: function () {
            this.info.group.logo = __uri('/components/default/jigou_logo@2x.png');
        },
        //支付订单
        submit: function () {
            var that = this;
            var type = this.thirdPayType;
            var pay;
            var info = this.info;

            var couponId = '';
            //如果抽奖码免单了，不能用优惠券
            if (!info.referalPrice || parseFloat(info.referalPrice) < parseFloat(info.amountPrice)) {
                couponId = this.selectedCoupons ? this.selectedCoupons.id : '';
            }

            if (type == configs.payType.ZHIFUBAO) {
                payZhifubao(orderId, couponId, successUrl);
            } else if (type == configs.payType.WEIXIN) {
                var uid = "wechatPay" + (+new Date());
                store.set(uid, {
                    orderId: orderId,
                    couponId: couponId,
                    successUrl: successUrl
                });
                getWeChatCode(window.location.origin + __uri('../pay-wechat/pay-wechat.html'), uid);
            }
        },
        //显示优惠券列表
        showCoupons: function () {
            status.isShowCoupons = true;
        },
        //隐藏优惠券列表
        hideCoupons: function () {
            status.isShowCoupons = false;
        },
        //选择优惠券
        selectCoupon: function (item) {
            status.selectedCoupons = item;
            status.isShowCoupons = false;
        },
        unselectCoupon: function () {
            status.selectedCoupons = null;
            status.isShowCoupons = false;
        },
        //抽奖
        goLucky: function () {
            if (!status.disableLuckyButton && !status.isLuckyGoing) {
                status.isLuckyGoing = true;
                xhr({
                    url: "{student}/order/lucky",
                    type: 'post',
                    data: {
                        orderId: orderId,
                        luckyCode: status.luckyCode
                    },
                    success: function (data) {
                        status.isLuckyGoing = false;
                        status.info.referalPrice = data.luckyPrice;
                    },
                    error: function (data, msg) {
                        status.isLuckyGoing = false;
                        // status.info.referalPrice = 1100000;
                        modal.alert({
                            title: msg || '抽奖失败'
                        });
                    }
                });
            }
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        computed: {
            //禁用抽奖按钮
            disableLuckyButton: function () {
                return this.luckyCode.length < 2;
            },
            //显示抽奖成功
            showLucky: function () {
                return this.info && this.info.referalPrice && this.luckyCode;
            },
            //最终应付价格，此处应该使用数值计算，待优化
            price: function () {
                if (this.info) {
                    var p = new Big(this.info.amountPrice || 0); //课程优惠总金额
                    p = p.minus(this.luckyPrice); //减去抽奖码
                    p = p.minus(this.couponsPrice); //减去优惠券

                    p = p.valueOf();
                    return p > 0 ? p : 0;
                }
                return 0;
            },
            //最终显示的抽奖码价格
            luckyPrice: function () {
                var info = this.info || {};
                var y = parseFloat(info.referalPrice || 0),
                    z = parseFloat(info.couponPrice || (this.selectedCoupons && this.selectedCoupons.price) || 0),
                    x = parseFloat(info.amountPrice || 0);

                var big = new Big(x);
                big = big.minus(z);
                big = big.minus(y);
                if (0 <= big) {
                    return y;
                } else {
                    return big.plus(y).valueOf();
                }
            },
            //最终展示的优惠券价格
            couponsPrice: function () {
                var info = this.info || {};
                //是否抽奖码已经免单
                if (parseFloat(info.referalPrice) >= parseFloat(info.amountPrice)) {
                    return 0;
                } else {
                    //是否有用过的优惠券
                    //是否有已选的优惠券
                    return info.couponPrice || (this.selectedCoupons && this.selectedCoupons.price) || 0;
                }
            }
        },
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-payment': UI.payment
        },
        methods: actions
    });

    //初始化
    xhr({
        url: "{student}/order/prepay",
        data: {
            orderId: orderId
        },
        success: function (data) {
            status.info = data;
            status.isInit = false;
            //滚动到底部
            setTimeout(function () {
                window.scroll(0, 100000);
            }, 1000);
        },
        error: function (data, msg) {
            modal.alert({
                title: msg || '获取支付订单信息失败'
            });
            status.isInit = false;
        }
    });
} (window));
