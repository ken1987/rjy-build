/*  
 * 节目详情页
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */

(function(window) {

    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;    
    
    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-banner': UI.banner,
            'ui-dialog': UI.dialog
        },
        methods: {
            clickload: utils.downloadAppRedirect
        }
    });

})(this);