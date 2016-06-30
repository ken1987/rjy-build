/**
 * 收藏按钮
 * @require '../_.js'
 * @require '../icons/icons.js'
 */
window.RUI.headerCollect = {
    template: __inline('header-collect.tpl'),
    props: ['type', 'collected', 'id'],
    components: {
        'ui-icon': window.RUI.icons
    },
    computed: {
        name: function() {
            return 'collect' + (this.collected ? "ed" : "") + (this.type || "");
        }
    },
    methods: {
        click: function() {
            if (this.isSubmit) return;

            var xhr = window.RUtils.xhr;
            var that = this;

            if (this.collected) {
                xhr({
                    url: '{student}/favorite/group/cancel',
                    type: 'post',
                    data: {
                        groupId: this.id
                    },
                    error: function() {
                        that.collected = !this.collected;
                        that.$dispatch('alert', '取消收藏失败');
                    }
                });
            } else {
                xhr({
                    url: '{student}/favorite/group',
                    type: 'post',
                    data: {
                        groupId: this.id
                    },
                    success: function(data) {
                        if (data && data.couponNum) {
                            var title = '您获得' + data.groupName;
                            var content = data.couponNum + '张优惠券';
                            that.$dispatch('alert', title, content, true);
                        }
                    },
                    error: function() {
                        that.collected = !that.collected;
                        that.$dispatch('alert', '收藏机构失败');
                    }
                });
            }

            this.collected = !this.collected;
        }
    }
};
