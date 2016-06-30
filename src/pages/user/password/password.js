/*
 * 注册
 * @require /libs/vue.js
 * @require /libs/vue-validator.js
 * @require /components/components.js
 * @require /utils/utils.js
 */
(function(window) {
    var Vue = window.Vue;
    var VueValidator = window.VueValidator;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var store = utils.store;
    var urlParse = utils.urlParse;
    var validators = utils.validators;
    var modal = UI.modal;

    //私有变量
    var storeName = 'registerByCode';
    var baseTime = 100;

    //状态
    var status = {
        //标题
        title: "注册",
        //状态
        isShowAgreement: false, //是否显示用户协议
        isSubmiting: false, //是否正在提交
        showPassword: false, //是否显示密码
        time: 0, //倒计时
        //参数
        mobile: "",
        password: "",
        code: "" //手机验证码
    };

    //同步函数
    var mutations = {
        //初始化
        init: function() {
            //获取登录状态
            var data = store.get(storeName);
            if (data) {
                data = JSON.parse(data);
                var time = parseInt((new Date() - data.time) / 1000);
                if (time > baseTime) {
                    status.time = 0;
                } else {
                    status.time = baseTime - time;
                    status.mobile = data.mobile;
                    actions.countdown();
                }
            }
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
        beforeSubmit: function() {
            status.isLoading = false;
        },
        afterSubmit: function() {
            status.isLoading = true;
        },
        onSubmit: function() {
            window.location.href = __uri('/pages/user/index/index.html');
        },
        hideAgreement: function() {
            status.isShowAgreement = false;
        },
        showAgreement: function() {
            status.isShowAgreement = true;
        }
    };

    //包含异步操作的函数
    var actions = {
        init: mutations.init,
        //切换显示密码
        togglePassword: mutations.togglePassword,
        showAgreement: mutations.showAgreement,
        hideAgreement: mutations.hideAgreement,
        //验证手机
        validMobile: function() {
            if (this.$validation.mobile.invalid) {
                modal.alert({
                    title: '请输入手机号码！'
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
                xhr({
                    url: url,
                    data: {
                        mobile: status.mobile,
                        role: 1, //学生
                        type: 2 //找回密码
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
        submit: function() {
            if (status.isSubmiting) return;

            var v = this.$validation;

            if (!this.validMobile()) return;

            if (v.code.invalid) {
                modal.alert({
                    title: '请输入验证码！'
                });
                return;
            }

            if (v.password.invalid) {
                modal.alert({
                    title: '请输入登录密码！'
                });
                return;
            }


            //注册
            mutations.beforeSubmit();

            xhr({
                url: "{student}/phone/password",
                type: "post",
                data: {
                    mobile: status.mobile,
                    password: status.password,
                    code: status.code
                },
                success: function(data) {
                    mutations.afterSubmit();
                    mutations.onSubmit();
                },
                error: function(r, msg) {
                    mutations.afterSubmit();
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
            'ui-checkbox': UI.checkbox,
            'ui-button': UI.button,
            'ui-button-code': UI.buttonCode,
            'ui-password-strong': UI.passwordStrong
        }
    });

    //初始化
    actions.init();
}(window));