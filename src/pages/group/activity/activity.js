/*
 * 活动列表
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
    var geolocation = utils.geolocation;

    //状态
    var status = {
        title: "活动",
        activityUrl: __uri('/pages/activity/details/details.html'), //活动详情
        //状态
        isLoading: true,
        isLastPage: true,
        isEmpty: false,
        //参数
        options: {
            lat: 0,
            lon: 0,
            groupId: utils.urlParse().search['groupId'],
            cursor: null,
            pageNo: 0,
            pageSize: 10
        },
        //列表信息
        items: []
    };

    //同步函数
    var mutations = {
        afterUpdate: function() {
            status.isLoading = false;
        },
        beforeUpdate: function() {
            status.options.pageNo++;
            status.isLoading = false;
        },
        onUpdate: function(data) {
            var options = status.options;
            options.cursor = data.cursor;
            status.isLastPage = options.pageNo * options.pageSize >= data.dataTotal;
            status.items = status.items.concat(data.data);
            status.isEmpty = !status.items.length;
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            mutations.beforeUpdate();
            xhr({
                url: "{student}/activity/list",
                data: status.options,
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
            'ui-list': UI.list,
            'ui-loading': UI.loading,
        },
        methods: actions
    });
    
    var showCookie = (function() {
            var channelId = "channelId";
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(channelId + "=");
                if (c_start != -1) {
                    return false;
                }
            }
            return true;
    }());

    if(showCookie){
         geolocation(function(lon, lat) {
            status.isLoading = false;
            status.options.lon = lon;
            status.options.lat = lat;
            actions.load();
        }, function(msg) {
            console.error(msg);
            status.isLoading = false;
            actions.load();
        });   
     }else{
        status.isLoading = false;
        actions.load();
     }
     
}(window));
