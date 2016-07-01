/**
 * 后退按钮
 * @require '../_.js'
 * @require '../icons/icons.js'
 */
module.exports = {
    template: __inline('header-back.tpl'),
    props: ['type'],
    components: {
        'ui-icon': require('../icons/icons')
    },
    computed: {
        name: function () {
            return 'back' + (this.type || '');
        }
    },
    methods: {
        back: function () {
            window.history.back();
        }
    }
};
