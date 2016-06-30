/**
 * 对话框
 * @require '../_.js'
 */
window.RUI.dialog = {
    template: __inline('dialog.tpl'),
    props: ['show'],
    methods: {
        confirm: function() {
            var fn = this.show && this.show.onConfirm;
            if (typeof fn == 'function') {
                fn();
            }
            this.show = null;
        },
        cancel: function() {
            var fn = this.show && this.show.onCancel;
            if (typeof fn == 'function') {
                fn();
            }
            this.show = null;
        }
    },

    ready: function(){
        var that = this;
        console.log(that.show);
        if(this.show){
            if(this.show.time){
                window.setTimeout(function(){
                    that.show = null; 
                },this.show.time);
               
            }            
        }
        
    }
};
