/*
 * 课程报名
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;

    window.RAPP = window.RAPP || {};
    window.RAPP.courseEnroll = {
        template: __inline('enroll.tpl'),
        props: ['info'],
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack
        },
        methods: {
            enroll: function() {
                this.$dispatch('onenroll');
            },
            getDefaultGroupImg: function() {
                this.info.group.logo = __uri('/components/default/jigou_logo@2x.png'); 
            }
        }
    };
}(window));