/**
 * 导航
 * @require '../_.js'
 */
window.RUI.nav = {
    template: __inline('nav.tpl'),
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            items: [{
                name: '首页',
                index: 1,
                url: "/"
            }, {
                name: '机构',
                index: 5,
                url: "/group"
            }, {
                name: '活动',
                index: 2,
                url: "/activity"
            }, {
                name: '我的',
                index: 4,
                url: "/user"
            }]
        };
    },
    methods: {
        toggle: function() {
            this.isOpen = !this.isOpen;
        }
    }
};
