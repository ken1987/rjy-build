/*
 * 活动详情
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var loginRedirect = utils.loginRedirect;
    var modal = UI.modal;

    //状态
    var status = {
        title: "活动详情",
        isLoading: false,
        id: utils.urlParse().search['id'],
        info: null,
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
            //图片格式
            var n, images = [];
            for (var i = 0, l = data.images.length; i < l; i++) {
                n = data.images[i];
                images.push({
                    imgUrl: n.uri
                });
            }
            data.images = images;

            //地图链接
            if(data.address.lon && data.address.lat){
                data.mapUrl = __uri('/pages/map/map.html') +
                    '?lon=' + data.address.lon +
                    "&lat=" + data.address.lat +
                    "&address=" + (data.address.abbreName || data.address.name || '') +
                    "&name=" + (data.address.name || '');
            }

            //机构链接
            data.groupUrl = __uri('/pages/group/index/index.html') +
                '?id=' + (data.group && data.group.id || '');

            //详情
            if(data.desc){
                data.desc=data.desc.replace(/[\r\n]/g,'<br>');
            }

            status.info = data;
        },
        afterSubmit: function() {
            status.isSubmit = false;
        },
        beforeSubmit: function() {
            status.isSubmit = true;
        },
        onSubmitError: function(data, msg, code) {
            mutations.afterSubmit();
            if (code == 10) {
                loginRedirect(location.href, __uri('/pages/user/login/login.html'));
            } else {
                status.dialog = {
                    title: '提交失败',
                    content: msg
                };
            }
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (status.isLoading) return;

            mutations.beforeUpdate();

            xhr({
                url: "{student}/activity/info",
                data: {
                    id: status.id
                },
                success: function(data) {
                    mutations.onUpdate(data);
                    mutations.afterUpdate();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
                }
            });
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-banner': UI.banner,
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-dialog': UI.dialog
        },
        methods: {
            //报名
            submit: function() {
                if (!status.isSubmit) {
                    mutations.beforeSubmit();
                    //活动报名
                    xhr({
                        url: '{student}/activity/signup/add',
                        type: 'post',
                        data: {
                            id: status.id
                        },
                        success: function(data) {
                            mutations.afterSubmit();
                            status.dialog = {
                                title: '报名成功',
                                onConfirm: function() {
                                    status.info.signStatus = 2;
                                }
                            };
                        },
                        error: mutations.onSubmitError
                    });
                }
            },
            //取消活动报名
            deleteSubmit: function() {
                if (!status.isSubmit) {
                    modal.confirm({
                        title: "您确定取消报名吗？",
                        onConfirm: function() {
                            mutations.beforeSubmit();
                            xhr({
                                url: '{student}/activity/signup/cancel',
                                type: 'post',
                                data: {
                                    id: status.id
                                },
                                success: function(data) {
                                    mutations.afterSubmit();
                                    status.info.signStatus = 0;
                                },
                                error: mutations.onSubmitError
                            });
                        }
                    });
                }
            }
        }
    });

    //初始化
    actions.load();
}(window));