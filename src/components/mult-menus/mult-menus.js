/**
 * 多级菜单
 * @require '../_.js'
 */
window.RUI.multMenus = {
    template: __inline('mult-menus.tpl'),
    props: {
        models: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    methods: {
        select: function(item, model, level) {
            model.id = item.id;
            var child = item.items;
            //如果没有子集，说明到了根部
            if (!child) {
                this.$dispatch('change', item);
            } else {
                //删除level之后的数据，并添加一条新的数据
                level++;
                this.models.splice(
                    level,
                    this.models.length - level, {
                        id: void 0,
                        items: child
                    }
                );
            }
        }
    }
};
