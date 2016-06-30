/**
 * 通用列表组件
 * @require '../_.js'
 */
window.RUI.list = {
    template: __inline('list.tpl'),
    props: {
        isLoading: {
            default: false
        },
        isEmpty:{
            default: false
        },
        isDisable:{
            default: false
        },
        isLastPage:{
            default: false
        },
        emptyMessage: {
            type: String,
            default: '暂无内容'
        },
        loadingMessage: {
            type: String,
            default: '正在加载...'
        },
        moreMessage: {
            type: String,
            default: '点击加载更多'
        }
    },
    methods: {
        loadMore: function() {
            this.$dispatch('load-more');
        }
    }
};
