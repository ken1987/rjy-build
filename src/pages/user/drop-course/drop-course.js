/*
 * 退课
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
        isLoading: false,
        cause: '',
        dialog: null,
        items: [
            '服务态度不好',
            '教学环境不理想',
            '上课地点不符',
            '上课时间不符',
            '课程价格比线下贵',
            '一直无法安排上课',
            '线下加价或强制购买物品',
            '其他原因'
        ]
    };

    //包含异步操作的函数
    var actions = {
        refund: function() {
            var cause = status.cause;
            if (!cause) {
                status.dialog = {
                    title: '选择理由'
                };
                return;
            }
            xhr({
                type: 'POST',
                url: "{student}/order/refund/apply",
                data: {
                    orderId: id,
                    cause: status.cause
                },
                success: function(data) {
                    status.dialog = {
                        title: '提交成功',
                        onConfirm: function() {
                            window.location.href = __uri('/pages/user/index/index.html');
                        }
                    };
                },
                error: function(r, msg) {
                    status.dialog = {
                        title: '提交失败'
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
