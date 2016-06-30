/**
 * 支付方式
 * @require '../_.js'
 * @require '/utils/device.js'
 * @require '/configs/configs.js'
 */
window.RUI.payment = (function(window) {
    var payType = window.RConfigs.payType;
    var types = [],
        dt = payType.ZHIFUBAO;

    //如果不在微信里面，过滤微信支付
    if (window.RUtils.device.isWeChat) {
        types.push({
            name: '微信',
            icon:'wx',
            type: payType.WEIXIN
        });
        dt = 'payType.WEIXIN';
    } else {
        types.push({
            name: '支付宝',
            icon:'zfb',
            type: payType.ZHIFUBAO
        });
    }

    return {
        template: __inline('payment.tpl'),
        props: {
            type: {
                default: dt
            },
        },
        data: function() {
            return {
                types: types
            };
        },
        methods: {
            change: function(type) {
                this.type = type;
            }
        }
    };
}(this));
