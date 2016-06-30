/*
 * 下拉菜单
 * @require 'libs/fastclick.js'
 * @require '../_.js'
 * @require "../mult-menus/mult-menus.js"
 * @require "../mult-search/mult-search.js"
 */

(function(window) {
    var RUI = window.RUI;
    var FastClick = window.FastClick;
    //获取显示项目
    var getModels = function(items, id) {
        var data, n, pid;
        for (var i = 0, l = items.length; i < l; i++) {
            n = items[i];
            pid = n.id;
            if (n.items) {
                data = getModels(n.items, id);
                if (data) {
                    data.unshift({
                        id: pid,
                        items: items
                    });
                    return data;
                }
            } else {
                if (pid == id) {
                    return [{
                        id: pid,
                        items: items
                    }];
                }
            }
        }
    };

    //解决click兼容问题
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);

    RUI.selectMenu = {
        template: __inline('select-menu.tpl'),
        components: {
            'ui-mult-search': RUI.multSearch,
            'ui-mult-menus': RUI.multMenus,
        },
        props: {
            items: {
                default: []
            },
            active: {
                default: -1
            },
            rankId:{
                default: 4
            },
            startPrice:{
                default: null
            },
            endPrice:{
                default: null    
            }
        },

        computed: {
            models: function() {
                var data;
                if (this.active > -1) {
                    var item = this.items[this.active];
                    var options = item.options;
                    var id = item.id;
                    data = getModels(options, id) || {
                        items: options,
                        id: null
                    };
                }

                data.rankId = this.rankId;
                data.startPrice = this.startPrice;
                data.endPrice = this.endPrice;

                return data;
            }
        },
        
        methods: {
            toggle: function(active,item) {
                if (this.active == active) {
                    active = -1;
                }
                this.active = active;
                this.rankId = item.rankId;
                this.startPrice = item.startPrice;
                this.endPrice = item.endPrice;
            },
            onchange: function(item) {
                this.$dispatch('change', this.active, item);
                this.active = -1;
            },

            onsearch: function(searchObj) {
                this.$dispatch('search', searchObj);
                this.active = -1;
            },
        },

        ready: function() {
            var that = this;
            var fn = function() {
                that.active = -1;
            };

            //阻止冒泡
            this.$el.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            this.$watch('active', function(val) {
                if (val == -1) {
                    document.removeEventListener('click', fn);
                } else {
                    document.addEventListener('click', fn, false);
                }
            });
        }
    };
}(this));
