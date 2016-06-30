/*
 * 登录
 * @require /libs/vue.js
 * @require /libs/vue-validator.js
 * @require /components/components.js
 * @require /utils/utils.js
 * @require /configs/configs.js
 * @require /libs/vue-router.js
 */

(function(window){
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
    var VueRouter = window.VueRouter;

    //开启debug 模式
    Vue.config.debug = true;

    //私有变量
    var storeName = 'loginByCode';
    var baseTime = 100;
    var isWechat = utils.device.isWeChat; //是否是微信

    //网址来源
    var ref = urlParse().search['ref'];
    if (ref) {
        ref = window.decodeURIComponent(ref);
    } else {
        ref = location.origin + __uri('/referral/#/list');
    }

    //详情页的url
    var detailUrl = "/referral/#/detail/";


    var status = {
        //标题
        title: "推荐码奖金查询",
        //状态
        isLogining: false, //是否正在登录
        showPassword: false, //是否显示密码
        loginType: 1, //登录方式 0 密码 1 验证码
        time: 0, //倒计时
        //参数
        mobile: "",
        password: "",
        code: "",
        authToken: "",

        //listinfo
        groups:[],
        options: {
            regionId: null,
            sortType: 1,
            sortAsc: true,
            cursor: null,
            pageNo: 0,
            pageSize: 10
        },

        //detailinfo
        detail:{},

        listInfo: {},
        curweek:{},
        historys:{
            perItemPrice: "",
            weekPrice: "",
            newcomerPrice: ""
        }
    };


    //同步函数
    var mutations = {

        togglePassword: function() {
            status.showPassword = !status.showPassword;
        },
        //验证码操作
        setTime: function() {
            status.time = baseTime;
            store.set(storeName, JSON.stringify({ 
                time: +new Date(),  
                mobile: status.mobile,
                smsCode: status.code,
                authToken: status.authToken
            }));
            //缓存有效时间，防止刷新
        },
        
        //登录操作
        beforeLogin: function() {
            status.isLogining = true;
        },
        afterLogin: function() {
            status.isLogining = false;
        },
        afterUpdate: function(){

        },

        onLogin: function(data) {
            if (isWechat) {
                utils.bindWeChatOpenId(ref);
            } else {
                status.authToken = data.authToken;
                mutations.setTime();
                for (var i = 0, l = data.groups.length; i < l; ++i) {
                    data.groups[i].url = detailUrl + data.groups[i].groupId +"/"+ data.groups[i].code;
                }
                
                status.groups = data.groups;
                if(data.groups.length === 1){
                    var group = data.groups[0];
                    router.go('/detail/' + group.groupId + '/' + group.code); 
                }else{
                    router.go('/list');    
                }
                
                //window.location.href = ref;
            }
        },

        onList: function(data){
            if(data.groups){
                for (var i = 0, l = data.groups.length; i < l; ++i) {
                        data.groups[i].url = detailUrl + data.groups[i].groupId +"/"+ data.groups[i].code;
                    }
                status.authToken = data.authToken;
                console.log(data.authToken);   
                status.groups = data.groups;
            }else{
                console.log('ok');
            }

        },

        detailInfo: function(data){
            status.detail = data;
            console.log(data);
        },
        curweekInfo: function(data){
            status.curweek = data;
            console.log(status.curweek);
        },
        historyInfo: function(data){
            status.historys = data.data;
            console.log(status.historys);
        }
    };

    var actions = {
        countdown: function(){},

        allTest: function(){
            var data = store.get(storeName);
            if(data){
                var dataToken = JSON.parse(data);
                if(dataToken){
                    status.mobile = dataToken.mobile ;
                    status.smsCode = dataToken.smsCode;
                }
                
                xhr({
                    type: "post",
                    url: "{customer}/referral/login",
                    data: {
                        mobile: status.mobile,
                        smsCode: status.smsCode 
                    },
                    success: function(data) {
                        mutations.onList(data);
                        status.authToken = data.authToken;
                    },
                    error: function(r, msg) {
                        mutations.afterUpdate();
                        modal.alert({
                            title: msg || '网络异常'
                        });
                    }
                });

            }else{
                router.go('/login');
            }            
        }

    };


    //login模块
    var Login = Vue.extend({
        template: __inline('../login/login.html'), 
        validators: validators,   //新增验证方法
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-button': UI.button,
            'ui-button-code': UI.buttonCode
        },
        data:function(){
            return status;
        },
        methods: {
            //验证手机
            validMobile: function() {
                var m = this.$validation.mobile;
                if (m.invalid) {
                    modal.alert({
                        title: m.required ? '请输入手机号码！' : "手机号码输入错误",
                        time: 2000
                    });
                    return false;
                } else {
                    return true;
                }
            },

            //获取验证码
            getCode: function(url) {

                if (status.isLogining) return;

                //var v = this.$validation;

                if(!this.validMobile()) return;
                

                var title;

                //alert(status.time);

                if (status.time <= 0) {

                    //这里存在兼容问题
                    mutations.setTime();   
                    
                    xhr({
                        type: 'get',
                        url: url,
                        data: {
                            mobile: status.mobile,
                            type: 1
                        },
                        success: function(){
                            modal.alert({
                                title: '已发送，请注意查收短信或电话！'
                            });
                        },
                        error: function(r, msg){
                            modal.alert({
                                title : msg || '网络异常',
                                time: 2000
                            }); 
                            mutations.setTime(0);
                        }
                    });
                    
                } else {
                    modal.alert({
                        title : '已发送，请' + status.time + '秒后再试！',
                    });
                }  
            },

            //电话获取验证码
            getCodeByTel: function() {
                this.getCode("{common}/sms/getvoice");
            },

            //短信获取验证码
            getCodeBySMS: function() {
                this.getCode("{customer}/referral/login/sms");
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
                            title: '请输入验证码！',
                        });
                        return;
                    } else {
                        url = '{customer}/referral/login';
                        data.code = status.code;
                    }
                } else {
                    if (v.password.invalid) {
                        modal.alert({
                            title: '请输入登录密码！'
                        });
                        return;
                    } else {
                        url = '{common}/referral/login/sms';
                        data.password = status.password;
                        data.keep = 1;
                    }
                }

                //登录
                mutations.beforeLogin();

                xhr({
                    type: "post",
                    url: url,
                    data: {
                        mobile: status.mobile,
                        smsCode: status.code
                    },
                    success: function(data) {

                        mutations.onLogin(data);
                        mutations.afterLogin();
                    },
                    error: function(r, msg) {
                        mutations.afterLogin();
                        modal.alert({
                            title: '输入验证码错误',
                            time: 2000
                        });
                    }
                });
            }            
        }
    });    

    //list模块
    var List = Vue.extend({
        template: __inline('../list/list.html'), 
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
        },
        data: function(){
            return status;
        },

        ready: function(){
            //获取登录态
            actions.allTest();
        }
    }); 
    
    //detail模块
    var Detail = Vue.extend({
        template: __inline('../detail/detail.html'), 
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
        },
        data: function(){
            return status;
        },

        methods: {
        },

        ready: function(){
            //获取登录态
            var detailArr =  location.hash.split("/");
            var detailId = detailArr[detailArr.length - 2];
            var codeId = detailArr[detailArr.length - 1];
            var data = store.get(storeName);

            if(data){
                data = JSON.parse(data);
                status.authToken = data.authToken;

                if(status.authToken){
                    xhr({
                        url: "{customer}/referral/get",
                        data: {
                            authToken: status.authToken,
                            groupId: detailId,
                            code:codeId
                        },
                        success: function(data) {
                            mutations.detailInfo(data);
                        },
                        error: function(r, msg) {
                            mutations.afterUpdate();
                            modal.alert({
                                title: msg || '网络异常'
                            });
                        }
                    });

                    //推荐码本周奖励查询
                    xhr({
                        url: "{customer}/referral/reward/curweek",
                        data: {
                            authToken: status.authToken,
                            groupId: detailId,
                            code:codeId
                        },
                        success: function(data) {
                            mutations.curweekInfo(data);
                        },
                        error: function(r, msg) {
                            mutations.afterUpdate();
                            modal.alert({
                                title: msg || '网络异常'
                            });
                        }
                    });

                    //推荐码历史奖励查询
                    xhr({
                        url: "{customer}/referral/reward/history",
                        data: {
                            authToken: status.authToken,
                            groupId: detailId,
                            code:codeId
                        },
                        success: function(data) {
                            mutations.historyInfo(data);
                        },
                        error: function(r, msg) {
                            mutations.afterUpdate();
                            modal.alert({
                                title: msg || '网络异常'
                            });
                        }
                    });

                }else{
                    router.go('/list/');
                }                
            }
        }
        
    }); 
    
    //Main 模块
    var Main = Vue.extend({
        ready: function(){
            var mainUrl = location.hash.split("/");
            if(mainUrl[1] === ""){
                window.location.href="/referral/#/login";
            }
            
        }
    });  

    //实例化路径
    var router = new VueRouter({
        hashbang: false,           //  路径格式化  /#!/ or /#/
        linkActiveClass: 'active',     //配置当 v-link 元素匹配的路径时需要添加到元素上的 class 
    });

    //规定路径
    router.map({
        '/': {
            component: Main,
        },

        '/login': {
            component: Login
        },        

        '/list': {
            component: List
        },

        '/detail/:id/:code': {
            component: Detail
        },

    });    

    //路由开始
    router.start(Main, '#wrap');

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
        }else{
            console.log(1);
        }
    }());  

}(window));