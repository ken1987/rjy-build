/*
 * 订单详情
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
    var modal = UI.modal;
    
    //状态
    var status = {
        isLoading: false,
        infoUrl: __uri('/pages/course/snapshots/snapshots.html') + '?id=' + id,
        info: null,
        dialog: null
    };

    //同步函数
    var mutations = {
        afterLoad: function() {
            status.isLoading = false;
        },
        beforeLoad: function() {
            status.isLoading = true;
        },
        onLoad: function(data) {
            status.info = data;
        },
        onAccept: function() {
            window.location.reload();
        },
        onConfirm: function() {
            window.location.reload();
        },
        onRefund: function() {
            window.location.reload();
        },
        afterUpdate: function(){}
    };

    //包含异步操作的函数
    var actions = {
        //获取默认图片
        getDefaultImg: function() {
            this.info.group.logo = __uri('/components/default/kechengliebiao@2x.png');
        },
        //加载
        load: function() {
            if (status.isLoading) return;

            mutations.beforeLoad();
            xhr({
                url: "{student}/order/detail",
                data: {
                    orderId: id
                },
                success: function(data) {
                    mutations.onLoad(data);
                    mutations.afterLoad();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
                    modal.alert({
                        title:msg,
                    });
                }
            });
        },
        //支付
        pay: function() {
            window.location = __uri('/pages/pay/index/index.html') + "?id=" + id;
        },
        //取消课程
        cancel: function() {
            status.dialog = {
                type: 'confirm',
                title: '是否取消课程？',
                cancelText: '否',
                confirmText: '是',
                onConfirm: function() {
                    xhr({
                        type: 'post',
                        url: "{student}/order/cancel",
                        data: {
                            orderId: id
                        },
                        success: function(data) {
                            status.dialog = {
                                title: '取消课程成功',
                                onConfirm: function() {
                                    window.location.reload();
                                }
                            };
                        },
                        error: function(r, msg) {
                            status.dialog = {
                                title: '取消课程失败'
                            };
                        }
                    });
                }
            };
        },
        //确定开课
        confirm: function() {
            status.dialog = {
                type: 'confirm',
                title: '为避免因此产生的纠纷，请确认已开始学习，再点确认',
                cancelText: '否',
                confirmText: '是',
                onConfirm: function() {
                    xhr({
                        type: 'POST',
                        url: "{student}/order/confirm",
                        data: {
                            orderId: id
                        },
                        success: function(data) {
                            status.dialog = {
                                title: '确认开课成功',
                                onConfirm: function() {
                                    window.location.href = __uri('/pages/user/index/index.html');
                                }
                            };
                        },
                        error: function(r, msg) {
                            status.dialog = {
                                title: '确认开课失败'
                            };
                        }
                    });
                }
            };
        },
        //申请退课
        refund: function() {
            window.location.href = __uri('/pages/user/drop-course/drop-course.html') + '?id=' + id;
        },
        //接受不退课
        accept: function() {
            status.dialog = {
                type: 'confirm',
                title: '您是否接受不退课？',
                cancelText: '取消',
                confirmText: '接受',
                onConfirm: function() {
                    xhr({
                        url: "{student}/order/refund/acceptcancel",
                        data: {
                            orderId: id
                        },
                        success: function(data) {
                            status.dialog = {
                                title: '你已接受了不退课',
                                onConfirm: function() {
                                    window.location.reload();
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
        },
        //投诉课程
        complaint: function() {
            window.location = "complaint.html?id=" + id;
        },
        //评论课程
        comment: function() {
            window.location = "comment.html?id=" + id;
        }
    };

    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-dialog': UI.dialog
        },
        methods: actions,
        events: {
            alert: function(options) {
                options = options || {};
                options.type = 'alert';
                status.dialog = options;
            },
            confirm: function(options) {
                options = options || {};
                options.type = 'confirm';
                status.dialog = options;
            }
        }
    });

    //初始化
    actions.load();
}(window));
