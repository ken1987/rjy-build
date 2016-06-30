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
    var modal = UI.modal;
    var xhr = utils.xhr;

    //状态
    var store = {
        title: "荣誉墙详情",
        isLoading: false,
        id: utils.urlParse().search['id'],
        info: {
            "id": 1,
            "content":"荣誉墙内容是富文本，支持图文混排"
        }
    };

    //同步函数
    var mutations = {
        afterUpdate: function() {
            store.isLoading = false;
        },
        beforeUpdate: function() {
            store.isLoading = true;
        },
        onUpdate: function(data) {
            store.info = data;
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (store.isLoading) return;

            mutations.beforeUpdate();

            xhr({
                url: "{student}/group/honor/info",
                data: {
                    id: store.id
                },
                success: function(data) {
                    mutations.onUpdate(data);
                    mutations.afterUpdate();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
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
        data: store,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack
        }
    });

    //初始化
    actions.load();
}(window));
