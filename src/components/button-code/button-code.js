/**
 * 获取验证码按钮
 * @require '../_.js'
 * @require '../button/button.js'
 */
window.RUI.buttonCode = {
    template: __inline('button-code.tpl'),
    components: {
        'ui-button': window.RUI.button,
    },
    props: {
        //按钮大小
        size: {
            default: ''
        },
        //剩余秒数
        time: {
            default: 0
        }
    },
    computed: {
        type: function() {
            return this.time ? 'gray2' : "primary";
        },
        msg: function() {
            return this.time ? this.time + '秒后重新获取' : '获取验证码';
        }
    },
    methods: {
        //倒计时
        countdown: function() {
            var that = this;
            setTimeout(function() {
                that.time--;
            }, 1000);
        },
        clicks:function(){
            this.$dispatch('click');
        }
    },
    watch: {
        time: function(val) {
            if (val > 0) {
                this.countdown();
            }
        }
    }
};
