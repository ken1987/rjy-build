/*  
 * 套餐详情页
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */

(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var modal = UI.modal;
    var videojs = window.videojs;

   
    //状态
    var status = {
        title: "套餐详情",
        isLoading: false,
        dialog: null
    };

    //同步函数
    var mutations = {
        afterUpdate: function() {
            status.isLoading = false;
        },
        beforeUpdate: function() {
            status.isLoading = true;
        },
        onUpdate: function(data) {
            //修改当前页面title 的内容
            var title = data.title;
            status.title = title;
            document.title = title;
        },
        onError: function(msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        }
    };

    //包含异步操作的函数
    var actions = {
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-banner': UI.banner,
            'ui-dialog': UI.dialog
        },
        methods: {
            clickload: utils.downloadAppRedirect
        }
    });
}(window));
