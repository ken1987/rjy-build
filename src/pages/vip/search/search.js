/*
 * 登录
 * @require /libs/vue.js
 * @require /libs/vue-validator.js
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

    //私有变量
    var storeName = 'searchByCode';
    var baseTime = 100;
    var isWechat = utils.device.isWeChat; //是否是微信

    //网址来源
    var ref = urlParse().search['ref'];
    if (ref) {
        ref = window.decodeURIComponent(ref);
    } else {
        ref = location.origin + __uri('/pages/vip/detail/detail.html');
    }

    //状态
    var status = {
        //标题  
        title: decodeURI(utils.urlParse().search['name']),
        //状态
        isLogining: false, //是否正在登录
        showPassword: false, //是否显示密码
        showInfo: false,    // 是否显示查询结果
        exist:1,            //结果中是否存在

        //参数
        mobile: "",
        password: "",
        code: "",

        id:utils.urlParse().search['id']
    };

    //同步函数
    var mutations = {
       
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
        onLogin: function(data) {

            status.showInfo = true;

            if (isWechat) {
                utils.bindWeChatOpenId(ref);
            } else {
                console.log(data);
                //window.location.href = ref;
            }
        }
    };

    //包含异步操作的函数
    var actions = {

        //验证手机
        validMobile: function() {
            var m = this.$validation.mobile;
            if (m.invalid) {
                modal.alert({
                    title: m.required ? '请输入手机号码！' : "手机号码输入错误",
                    time:2000
                });
                return false;
            } else {
                return true;
            }
        },

        //查询
        searchMoblie: function() {

            if (status.isLogining) return;

            var v = this.$validation;

            if(!this.validMobile()) return;

            //查询
            mutations.beforeLogin();

            xhr({
                url: '{customer}/vip/exist',
                data: {
                   mobile: status.mobile, 
                },
                success: function(data){
                    status.exist = data.exist;
                    mutations.onLogin(data);
                    mutations.afterLogin();
                },
                error: function(r, msg) {
                    mutations.afterLogin();
                    modal.alert({
                        title: msg || '网络异常',
                        time:2000
                    });
                }
            });
        },

        //edit
        editInfo: function(){
            window.location.href = ref;
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
        console.log(decodeURI(utils.urlParse().search['name']));
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
