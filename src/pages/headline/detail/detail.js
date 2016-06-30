/*
 * 机构简介
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;

    //状态
    var status = {
        title: "<img class='head-img' src='"+__uri('topline.png')+"'>",
        isLoading: false,
        id: utils.urlParse().search['id'],
        info: {
            time: "",
            updateTime: "",
            content: ""
        }
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
            data.updateTime = data.updateTime.replace(/([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d/,'');
            status.info = data;
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (status.isLoading) return;

            mutations.beforeUpdate();

            xhr({
                url: "{student}/content/headline",
                data: {
                    headlineId: status.id
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
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
        },
        methods: {
            
        }
    });

    //初始化
    actions.load();
}(window));
