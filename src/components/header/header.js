/**
 * 头部
 * @require '../_.js'
 * @require '../utils/device.js'
 */
window.RUI.header = {
    data:function(){
        return {
            showhead: true,
        };
    },

    props: ['title', 'type'],

    template: __inline('header.tpl'),
    computed: {
        exClass: function() {
            return this.type ? "m-header_style" + this.type : "";
        },
        showhead: function(){
            var UA = window.RUtils.device;
            if(UA.isWeChat || (UA.isQQ && !UA.isMQQBrowser) || UA.isRUNEDU){
                return false;
            }else{
                return true;
            }
        }
    },

    ready: function(){
        if(this.title){
            if(this.title.indexOf("img") > 0){
                return ;      
            }else{
                // alert(navigator.userAgent);
                document.title = this.title;
            }
        }
    }

};
