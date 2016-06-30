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
        title: "活动列表",
        detailUrl: __uri('../details/details.html'),
        //状态
        isLoading: true,
        isLastPage: true,
        isEmpty: false,
        //参数
        options: {
            cursor: null,
            pageNo: 0,
            pageSize: 10,
            categoryId: '',
            lon: null,
            lat: null
        },
        items: [],
        category: [{
            name: '全部',
            id: ''
        }],

        showSort: false, //排序dom显示
        sortMethod: [
            {
                name: "默认排序",
                id: 0,
                isClick:true,
            },
            {
                name: "离我最近",
                id: 1,
                isClick:false,
            }
        ],
    };

    //同步函数
    var mutations = {
        onInit: function(id) {
            status.options.pageNo = 0;
            status.options.cursor = null;
            status.options.categoryId = id;
            status.items = [];
        },
        afterUpdate: function() {
            status.isLoading = false;
        },
        beforeUpdate: function() {
            status.options.pageNo++;
            status.isLoading = false;
        },
        onUpdate: function(data) {
            status.isLoading = false;
            var options = status.options;
            options.cursor = data.cursor;
            status.isLastPage = options.pageNo * options.pageSize >= data.dataTotal;
            if (status.showSort) {
                status.items = [] ;
            }else{
                status.items = status.items.concat(data.data);
            }
            
            status.isEmpty = !status.items.length;
        },
        updateCategory: function(data) {
            status.category = status.category.concat(data);
            status.isEmpty = !status.items.length;
        },

        onUpdateSort: function(data) {
            status.items = [];
            var options = status.options;
            options.cursor = data.cursor;
            status.isLastPage = options.pageNo * options.pageSize >= data.dataTotal;
            status.items = status.items.concat(data.data);
            status.isEmpty = !status.items.length;
        },

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
        },
        change: function(index, item) {
            mutations.onInit(item.id);
            actions.load();
        },

        setSort: function(showsort){
            status.showSort = !status.showSort;
        },

        getSort: function(index){

            if( !status.options.lat){
                return;
            }else{
            
                if(status.sortMethod[index].isClick){

                }else{

                   for (var i = 0, l = status.sortMethod.length; i < l; ++i) {
                       status.sortMethod[i].isClick = false;
                   }

                    status.sortMethod[index].isClick = true;
                    status.options.sortType = index;

                    xhr({
                        url: "{student}/activity/list",
                        data: status.options,
                        success: function(data) {
                            mutations.onUpdateSort(data);
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
            }
        },
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
            'ui-icon': UI.icons,
            'ui-slide-nav': UI.slideNav,
            'ui-loading': UI.loading
        },
        methods: actions
    });

    //初始化
    xhr({
        url: "{student}/activity/categories",
        success: mutations.updateCategory
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
