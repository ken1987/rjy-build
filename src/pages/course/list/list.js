/*
 * 课程详情页面
 * @require /libs/vue.js
 * @require /components/components.js
 * @require /utils/utils.js
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var geolocation = utils.geolocation;
    var search = utils.urlParse().search;
    var modal = UI.modal;

    var subjectName = '全部科目',
        subjectId = window.decodeURIComponent(search['subjectId'] || "");

    if (subjectId) {
        subjectName = window.decodeURIComponent(search['subjectName'] || "");
    }

    var status = {
        title: '课程列表',
        //下拉菜单
        menus: [{
            name: subjectName,
            id: subjectId,
            options: []
        }, {
            name: '区域',
            id: "",
            options: []
        }, {
            name: '排序',
            id: "1",
            options: [{
                name: '离我最近',
                id: "1",
                sortType: '1',
                sortAsc: true
            }, {
                name: '价格低到高',
                id: "2",
                sortType: '2',
                sortAsc: true
            }, {
                name: '价格高到低',
                id: "3",
                sortType: '2',
                sortAsc: false
            }]
        },{
            name: '筛选',
            id: "",
            options:[],
            rankId: 4,
            startPrice: null,
            endPrice: null
        }],

        open: -1,
        //状态
        isLoading: true,

        isLastPage: true,
        isEmpty: false,
        //参数
        options: {
            subjectId: subjectId,
            regionId: null,
            sortType: 1,
            sortAsc: true,
            cursor: null,
            lon: null,
            lat: null,
            pageNo: 0,
            pageSize: 10
        },
        //列表信息
        items: [],
        // //默认值
        // rankId: 0,
    };

    //同步函数
    var mutations = {
        onInit: function(index, item) {
            var options = status.options,
                menus = status.menus,
                menu = menus[index];

            menu.id = item.id;
            menu.name = item.alias || item.name;

            options.pageNo = 0;
            options.cursor = null;
            options.subjectId = menus[0].id;
            options.regionId = menus[1].id;

            if (item.sortType !== void 0) {
                options.sortType = item.sortType;
            }

            if (item.sortAsc !== undefined) {
                options.sortAsc = item.sortAsc;
            }

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
                if (n.areas) {
                    n.areas.unshift({
                        name: '全部',
                        alias: n.name,
                        id: n.id
                    });
                }
                newData.push({
                    name: n.name,
                    id: n.id,
                    items: n.areas
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
                if (n.subCategories) {
                    n.subCategories.unshift({
                        name: '全部',
                        alias: n.name,
                        id: n.id
                    });
                }
                newData.push({
                    name: n.name,
                    id: n.id,
                    items: n.subCategories
                });
            }

            status.menus[0].options = newData;
        },

        searchPrice: function(searchObj){
            var options = status.options;
            options.minPrice = searchObj.minPrice;
            options.maxPrice = searchObj.maxPrice;
            status.menus[3].rankId = searchObj.rankId;
            status.menus[3].startPrice = searchObj.minPrice;
            status.menus[3].endPrice = searchObj.maxPrice;

            console.log(searchObj);
            options.pageNo = 0;
            options.cursor = null;

            status.items = [];
        },
    };

    //包含异步操作的函数
    var actions = {
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
                    url: "{student}/search/course",
                    data: status.options,
                    success: function(data) {
                        curAjax = null;
                        mutations.afterUpdate();
                        mutations.onUpdate(data);
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

        change: function(index, item) {
            if(item){
               mutations.onInit(index, item);
               actions.load(); 
            }else{
                console.log(index);
            }
                      
        },

        getDefaultImg: function(item) {
            item.group.logo = __uri('/components/default/kechengliebiao@2x.png');
        },

        search: function(searchObj){
            mutations.searchPrice(searchObj);
            actions.load();
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-banner-download': UI.bannerDownload,
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-select-menu': UI.selectMenu,
            'ui-scroll-top': UI.scrollTop,
            'ui-list': UI.list,
            'ui-loading': UI.loading
        },
        methods: actions
    });

    //初始化
    
    //获取地区数据
    xhr({
        url: "{common}/area/all",
        success: mutations.updateArea,
        error: function(r, msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        }
    });
    //获取课程分类
    xhr({
        url: "{common}/course/category/list",
        success: mutations.updateCategory,
        error: function(r, msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        }
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
