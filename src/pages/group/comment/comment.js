/*
 * 学员评论
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
        title: "学员评论",
        id: utils.urlParse().search['groupId'],
        //分数
        isScoreLoading: false,
        score: {
            count: 0,
            replyCount: 0,
            avgScore: 0,
            serviceScore: 0,
            envScore: 0,
            profScore: 0,
            courseScore: 0
        },
        //评论
        isListLoading: false,
        isLastPage: true,
        isEmpty: false,

        cursor: null,
        pageNo: 0,
        pageSize: 10,

        list: [
        // {
        //     courseName: "钢琴初级",
        //     content: "课程不错，老师很好",
        //     createTime: '2015-12-12 12:12:12',
        //     student: {
        //         nickName: "李四",
        //         profileImg: "http://profile.jpg"
        //     },
        //     img: [{
        //         uri: "http://img1.jpg"
        //     }],
        //     reply: 'xxxxxx'
        // }
        ]
    };

    //同步函数
    var mutations = {
        //分数
        afterScoreUpdate: function() {
            store.isScoreLoading = false;
        },
        beforeScoreUpdate: function() {
            store.isScoreLoading = true;
        },
        onScoreUpdate: function(data) {
            store.score = data;
        },
        //列表
        afterListUpdate: function() {
            store.isLoading = false;
        },
        beforeListUpdate: function() {
            store.pageNo++;
            store.isLoading = true;
        },
        onListUpdate: function(data) {
            store.cursor = data.cursor;
            store.isLastPage = store.pageNo * store.pageSize >= data.dataTotal;
            store.list = store.list.concat(data.data);
            store.isEmpty = !store.list.length;
        }
    };

    //包含异步操作的函数
    var actions = {
        loadScore: function() {
            mutations.beforeScoreUpdate();
            xhr({
                url: "{student}/group/comment/score",
                data: {
                    groupId: store.id
                },
                success: function(data) {
                    mutations.afterScoreUpdate();
                    mutations.onScoreUpdate(data);
                },
                error: function(r, msg) {
                    mutations.afterScoreUpdate();
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },
        loadList: function() {
            if (store.isListLoading) return;

            mutations.beforeListUpdate();

            xhr({
                url: "{student}/group/comment/list",
                data: {
                    groupId: store.id,
                    cursor: store.cursor,
                    pageNo: store.pageNo,
                    pageSize: store.pageSize
                },
                success: function(data) {
                    mutations.afterListUpdate();
                    mutations.onListUpdate(data);
                },
                error: function(r, msg) {
                    mutations.afterListUpdate();
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
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-list': UI.list
        },
        methods: {
            onLoadMore: actions.loadList
        }
    });

    //初始化
    actions.loadScore();
    actions.loadList();
}(window));
