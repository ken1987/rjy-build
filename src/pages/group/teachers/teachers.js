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

    //状态
    var store = {
        title:'全部老师',
        //状态
        isLoading: false,
        isLastPage: true,
        isEmpty: false,
        //参数
        options: {
            groupId: utils.urlParse().search['groupId'],
            cursor: null,
            pageNo: 0,
            pageSize: 10
        },
        //列表信息
        items: [
            // {
            //     id: 10,
            //     intro: "1212ffffff",
            //     name: "李老师",
            //     profileImg: "http://dn-edu-test.qbox.me/5461543249296470016",
            //     school: "12",
            //     teacherAge: 12,
            //     subjects:[{
            //         id:'',
            //         name:''
            //     }]
            // }
        ],
        
    };

    //同步函数
    var mutations = {
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
            store.title = '全部老师(' + data.dataTotal + ')';
            store.isLastPage = options.pageNo * options.pageSize >= data.dataTotal;
            store.items = store.items.concat(data.data).reverse();
            store.isEmpty = !store.items.length;
            store.totalNumber = data.dataTotal;
        }
    };

    //包含异步操作的函数
    var actions = {
        //获取机构数据
        load: (function() {
            var curAjax;
            return function() {
                if (store.isLoading) return;

                if (curAjax) {
                    curAjax.abort();
                    curAjax = null;
                }

                mutations.beforeUpdate();

                curAjax = xhr({
                    url: "{student}/group/teachers",
                    data: store.options,
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
        }())
    };

    //视图
    new Vue({
        el: '#wrap',
        data: store,
        props: ['store.totalNumber'],
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-list': UI.list
        },
        methods: {
            onLoadMore: actions.load
        }
    });

    //初始化
    actions.load();
}(window));
