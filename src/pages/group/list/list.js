/*
 * 机构列表
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var modal = UI.modal;
    var geolocation = utils.geolocation;

    //状态
    var status = {
        //标题
        title: "机构列表",
        //下拉菜单
        menus: [{
            name: '全部科目',
            id: "",
            options: []
        }, {
            name: '全部区域',
            id: "",
            options: []
        }, {
            name: '离我最近',
            id: "1",
            options: [{
                name: '离我最近',
                id: "1",
                sortType: '1',
                sortAsc: true
            }, {
                name: '评分最高',
                id: "2",
                sortType: '2',
                sortAsc: false
            }]
        }],
        open: -1,
        //状态
        isLoading: true,
        isLastPage: true,
        isEmpty: false,
        //参数
        options: {
            subjectId: null,
            regionId: null,
            sortType: 1,
            sortAsc: false,
            cursor: null,
            lon: null,
            lat: null,
            pageNo: 0,
            pageSize: 10
        },
        //列表信息
        items: []
    };

    //同步函数
    var mutations = {
        onInit: function(index, item) {
            var options = status.options,
                menus = status.menus,
                menu = menus[index];

            menu.id = item.id;
            menu.name = item.name;

            options.pageNo = 0;
            options.cursor = null;
            options.subjectId = menus[0].id;
            options.regionId = menus[1].id;
            options.sortType = item.sortType;
            options.sortAsc = item.sortAsc;

            status.items = [];

        },
        afterUpdate: function() {
            status.isLoading = false;
        },
        beforeUpdate: function() {
            status.options.pageNo++;
            status.isLoading = true;
        },
        onUpdate: function(data) {
            for (var i = 0, l = data.data.length; i < l; ++i) {
                if(!data.data[i].coverImg){
                    data.data[i].coverImg = __uri('/components/default/group-list.png');
                }
            }
            var options = status.options;
            options.cursor = data.cursor;
            status.isLastPage = options.pageNo * options.pageSize >= data.dataTotal;
            status.items = status.items.concat(data.data);
            status.isEmpty = !status.items.length;
        },
        updateArea: function(data) {
            data = data[0].areas[0].areas; //深圳内

            var n, newData = [{
                name: '全部区域',
                id: ''
            }];

            for (var i = 0, l = data.length; i < l; i++) {
                n = data[i];
                newData.push({
                    name: n.name,
                    id: n.id
                });
            }

            status.menus[1].options = newData;
        },
        updateCategory: function(data) {
            var n,
                newData = [{
                    name: '全部科目',
                    id: ''
                }];
            for (var i = 0, l = data.length; i < l; i++) {
                n = data[i];
                n.subCategories = null; //过滤子集
                newData.push({
                    name: n.name,
                    id: n.id,
                    items: n.subCategories
                });
            }
            status.menus[0].options = newData;
        }
    };

    //包含异步操作的函数
    var actions = {
        //获取地区数据
        getAreaAll: function() {
            xhr({
                url: "{common}/area/all",
                success: mutations.updateArea,
                error: function(r, msg) {
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },
        //获取课程分类
        getCategoryList: function() {
            xhr({
                url: "{common}/course/category/onlinelist",
                success: mutations.updateCategory,
                error: function(r, msg) {
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },
        //获取机构数据
        load: (function() {
            var curAjax;
            return function() {
                //if (status.isLoading) return;

                if (curAjax) {
                    curAjax.abort();
                    curAjax = null;
                }

                mutations.beforeUpdate();

                curAjax = xhr({
                    url: "{student}/search/group",
                    data: status.options,
                    success: function(data) {
                        curAjax = null;
                        mutations.onUpdate(data);
                        mutations.afterUpdate();
                    },
                    error: function(r, msg) {
                        curAjax = null;
                        mutations.afterUpdate();
                        modal.alert({
                            title: msg || '网络异常'
                        });
                    }
                });
            };
        }()),
        change: function(index, id, name) {
            mutations.onInit(index, id, name);
            actions.load();
        },
        getDefaultImg: function(item) {
            item.coverImg = __uri('/components/default/group-list.png');
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-nav': UI.nav,
            'ui-header-back': UI.headerBack,
            'ui-select-menu': UI.selectMenu,
            'ui-scroll-top': UI.scrollTop,
            'ui-list': UI.list,
            'ui-banner-download': UI.bannerDownload,
            'ui-loading': UI.loading
        },
        methods: {
            onLoadMore: actions.load,
            onSelectMenusChange: actions.change,
            getDefaultImg: actions.getDefaultImg
        }
    });

    //初始化
    actions.getAreaAll();
    actions.getCategoryList();

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
