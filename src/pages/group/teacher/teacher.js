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
    var status = {
        title: "",
        isLoading: false,
        id: utils.urlParse().search['id'],
        info: null,
        loading: true,
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
            status.loading = false;
            //服务说明
            data.intro && (data.intro = data.intro.replace(/[\n\r]/g, '<br>'));
            status.info = data;
            status.title = data.name;
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (status.isLoading) return;

            mutations.beforeUpdate();

            xhr({
                url: "{student}/teacher/info",
                data: {
                    id: status.id
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
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-loading': UI.loading,
        }
    });

    //初始化
    actions.load();
}(window));
