/*
 * 投诉
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var id = utils.urlParse().search['id'];

    //状态
    var status = {
        title: "投诉",
        isLoading: false,
        content: '',
        dialog: null,
        telephone: '0755-29888088'
    };

    //包含异步操作的函数
    var actions = {
        complain: function() {
            if (status.isLoading) return;

            var that = this;
            var cause = status.content;
            if (!/\S/.test(cause)) {
                status.dialog = {
                    title: '输入您要投诉的具体内容'
                };
                return;
            }

            if (cause.length > 100) {
                status.dialog = {
                    title: '内容长度需要在1到100之间'
                };
                return;
            }

            status.isLoading = true;

            xhr({
                url: "{student}/order/refund/complain",
                type: 'post',
                data: {
                    orderId: id,
                    cause: cause
                },
                success: function(data) {
                    status.isLoading = false;
                    status.dialog = {
                        title: '投诉成功',
                        onConfirm: function() {
                            window.location.href = __uri('/pages/user/index/index.html');
                        }
                    };
                },
                error: function(r, msg) {
                    status.isLoading = false;
                    status.dialog = {
                        title: '投诉失败'
                    };
                }
            });
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-dialog': UI.dialog
        },
        methods: actions
    });
}(window));
