/*
 * 登录
 * @require /libs/vue.js
 * @require /libs/vue-validator.js
 * @require /libs/md5.js
 * @require /components/components.js
 * @require /utils/utils.js
 * @require /configs/configs.js
 */
(function(window) {
    var configs = window.RConfigs;
    var Vue = window.Vue;
    var VueValidator = window.VueValidator;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var store = utils.store;
    var urlParse = utils.urlParse;
    var validators = utils.validators;
    var getWeChatCode = utils.getWeChatCode;
    var modal = UI.modal;
    var hex_md5 = window.hex_md5;

    //私有变量
    var storeName = 'loginByCode';
    var baseTime = 100;
    var isWechat = utils.device.isWeChat; //是否是微信
    var registerUrl = 'register.html';

    //网址来源
    var ref = urlParse().search['ref'];
    if (ref) {
        registerUrl += '?ref=' + ref;
        ref = window.decodeURIComponent(ref);
    } else {
        ref = location.origin + __uri('/pages/user/index/index.html');
    }

    //状态
    var status = {
        //标题
        title: "账号密码登录",
        registerUrl: registerUrl,
        //状态
        isLogining: false, //是否正在登录
        showPassword: false, //是否显示密码
        loginType: 0, //登录方式 0 密码 1 验证码
        time: 0, //倒计时
        //参数
        mobile: "",
        password: "",
        code: ""
    };

    //同步函数
    var mutations = {
        changeLoginType: function(type) {
            status.loginType = type;
            status.title = status.loginType === 0 ? '账号密码登录' : '手机验证码登录';
        },
        togglePassword: function() {
            status.showPassword = !status.showPassword;
        },
        //验证码操作
        setTime: function() {
            status.time = baseTime;
            store.set(storeName, JSON.stringify({ time: +new Date(), mobile: status.mobile }));
            //缓存有效时间，防止刷新
        },
        //登录操作
        beforeLogin: function() {
            status.isLogining = true;
        },
        afterLogin: function() {
            status.isLogining = false;
        },
        onLogin: function() {
            if (isWechat) {
                utils.bindWeChatOpenId(ref);
            } else {
                window.location.href = ref;
            }
        }
    };

    //包含异步操作的函数
    var actions = {
        //切换显示密码
        togglePassword: mutations.togglePassword,
        //切换登登录方式
        changeLoginType: mutations.changeLoginType,
        //验证手机
        validMobile: function() {
            var m = this.$validation.mobile;
            if (m.invalid) {
                modal.alert({
                    title: m.required ? '请输入手机号码！' : "手机号码输入错误"
                });
                return false;
            } else {
                return true;
            }
        },
        //获取验证码
        getCode: function(url) {
            if (!this.validMobile()) return;

            var title;
            if (status.time <= 0) {
                mutations.setTime();
                var t = new Date().getTime();
                var sign = t + 'h5' + 'rjy$ii893034!34';
                xhr({
                    type: 'post',
                    url: url,
                    data: {
                        mobile: status.mobile,
                        role: 1,
                        type: 9,
                        sign : hex_md5(sign),
                        t : t,
                    }
                });
                title = '已发送，请注意查收短信或电话！';
            } else {
                title = '已发送，请' + status.time + '秒后再试！';
            }
            modal.alert({
                title: title
            });
        },
        //电话获取验证码
        getCodeByTel: function() {
            this.getCode("{common}/sms/getvoice");
        },
        //短信获取验证码
        getCodeBySMS: function() {
            this.getCode("{common}/sms/getcode");
        },
        //登录
        login: function() {
            if (status.isLogining) return;

            var v = this.$validation;

            if (!this.validMobile()) return;

            var url,
                data = {
                    mobile: status.mobile
                };

            if (status.loginType) {
                if (v.code.invalid) {
                    modal.alert({
                        title: '请输入验证码！'
                    });
                    return;
                } else {
                    url = '{student}/login/withcode';
                    data.code = status.code;
                }
            } else {
                if (v.password.invalid) {
                    modal.alert({
                        title: '请输入登录密码！'
                    });
                    return;
                } else {
                    url = '{student}/login';
                    data.password = status.password;
                    data.keep = 1;
                }
            }
            //登录
            mutations.beforeLogin();

            xhr({
                type: "post",
                url: url,
                data: data,
                success: function(data) {
                    mutations.onLogin();
                    mutations.afterLogin();
                },
                error: function(r, msg) {
                    mutations.afterLogin();
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        methods: actions,
        validators: validators, //扩展验证方法
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-button': UI.button,
            'ui-button-code': UI.buttonCode
        }
    });

    //初始化
    (function() {
        var data = store.get(storeName); //获取登录状态
        if (data) {
            data = JSON.parse(data);
            var time = parseInt((new Date() - data.time) / 1000);
            if (time > baseTime) {
                status.time = 0;
            } else {
                status.time = baseTime - time;
                status.mobile = data.mobile;
                status.loginType = 1;
                actions.countdown();
            }
        }
    }());
}(window));
