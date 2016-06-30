/*
 * 机构课程列表
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
        groupId: utils.urlParse().search['groupId'],
        courseUrl: __uri('/pages/course/index/index.html'), //课程详情
        info: {},
        items:[],
        category:[],
        //状态
        isLoading: false,
        isLastPage: true,
        isEmpty: false,
        curId:'',
        //参数
        options: {
            subjectId: null,
            regionId: null,
            sortType: null,
            cursor: null,
            pageNo: 0,
            pageSize: 10
        },
        subjectId:''

    };

    //同步函数
    var mutations = {
        onInit: function(index, id, name) {
            var options = store.options,
                menus = store.menus,
                menu = menus[index];

            menu.id = id;
            menu.name = name;

            options.pageNo = 0;
            options.cursor = null;
            options.subjectId = menus[0].id;
            options.regionId = menus[1].id;
            options.sortType = menus[2].id;

            store.items = [];
            store.category = [];
        },

        afterUpdate: function() {
            store.isLoading = false;
        },

        beforeUpdate: function() {
            store.options.pageNo++;
            store.isLoading = true;
        },
        
        onUpdate: function(data) {
            var options = store.options;
            options.cursor = data.cursor;
            store.isLastPage = options.pageNo * options.pageSize >= data.dataTotal;
            //store.items = store.items.concat(data.data).reverse(); //添加倒序方法
            store.items = store.items.concat(data.data);
            store.isEmpty = !store.items.length;
        },
        onLoadCategory: function(data){
            store.category = store.category.concat(data);
        },
    };

    //包含异步操作的函数
    var actions = {
        load: function(subjectid) {
            if (store.isLoading) return;

            mutations.beforeUpdate();
            store.subjectId = subjectid;

            xhr({
                url: "{student}/course/group",
                data: {
                    id: store.groupId,
                    subjectId:store.subjectId
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
        },

        loadCategory: function() {           
            mutations.beforeUpdate();
            xhr({
                url: "{student}/course/group/subject",
                data: {
                    id: store.groupId                 
                },
                success: function(data) {
                    mutations.onLoadCategory(data);
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },

        change: function(id){
            store.curId=id;
            store.items=[];
            actions.load(id);
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: store,
        components: {
            'ui-header': UI.header,
            'ui-nav': UI.nav,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-list': UI.list
        },
        methods: {
            onLoadMore: actions.load,
            loadCourseBySubject: actions.change
        }
    });

    //初始化
    //课程列表
    actions.load();
    //机构教学科目
    actions.loadCategory();
}(window));
