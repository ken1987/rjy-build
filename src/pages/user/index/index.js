/*
 * 我的课程列表
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var type = utils.urlParse().search['type'];
    var title, otherTitle, link;

    if (!type) {
        type = 1;
        title = '我的课程';
        otherTitle = '全部课程';
        link = 'index.html?type=all';
    } else {
        type = 2;
        title = '全部课程';
        otherTitle = '我的课程';
        link = 'index.html';
    }

    //状态
    var status = {
        title: title,
        otherTitle: otherTitle,
        link: link,

        orderUrl: __uri('order.html'),
        items: [],

        isLoading: false,
        dataTotal: 0,
        pageNo: 0,
        pageSize: 10,
        type: type,

        dialog: null
    };

    //同步函数
    var mutations = {
        afterLoad: function() {
            status.isLoading = false;
        },
        beforeLoad: function() {
            status.pageNo++;
            status.isLoading = true;
        },
        onLoad: function(data) {
            status.dataTotal = data.dataTotal;

            var arr = data.data;
            for (var i = arr.length; i--;) {
                arr[i].isSubmit = false;
            }

            status.items = status.items.concat(arr);
        },
        onAccept: function() {

        },
        onConfirm: function() {

        },
        onCancel: function(data) {

        }
    };

    //包含异步操作的函数
    var actions = {
        //加载
        load: function() {
            if (status.isLoading) return;

            mutations.beforeLoad();

            xhr({
                url: "{student}/order/list",
                data: {
                    pageNo: status.pageNo,
                    pageSize: status.pageSize,
                    type: status.type
                },
                success: function(data) {
                    mutations.onLoad(data);
                    mutations.afterLoad();
                },
                error: function(r, msg) {
                    
                    mutations.afterLoad();
                }
            });
        },
        //支付
        pay: function(id) {
            window.location = __uri('/pages/pay/index/index.html') + "?id=" + id;
        },
        //确定开课
        confirm: function(id) {
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
        //接受不退课
        accept: function(id) {
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
        complaint: function(id) {
            window.location = "complaint.html?id=" + id;
        },
        //评论课程
        comment: function(id) {
            window.location = "comment.html?id=" + id;
        },
        //获取默认图片
        getDefaultImg: function(item) {
            item.group.logo = __uri('/components/default/kechengliebiao@2x.png');
        },
        //文案替换
        changeText: function(item) {
            var type = item.status;
            if (type == '3') {
                return '等待退课';
            } else if (type == '4') {
                return "退课中";
            } else if (type == '6') {
                return "投诉处理中";
            } else {
                return item.remark;
            }
        }
    };

    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-list': UI.list,
            'ui-dialog': UI.dialog
        },
        methods: actions,
        events: {
            alert: function(options) {
                status.dialog = options;
            }
        }
    });

    //初始化
    actions.load();
}(window));
