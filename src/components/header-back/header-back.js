/**
 * 后退按钮
 * @require '../_.js'
 * @require '../icons/icons.js'
 */
window.RUI.headerBack = {
    template: __inline('header-back.tpl'),
    props: ['type'],
    components: {
        'ui-icon': window.RUI.icons
    },
    computed: {
        name: function() {
            return 'back' + (this.type || "");
        }
    },
    methods: {
        back: function() {
            window.history.back();
        }
    }
};
