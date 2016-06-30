/**
 * 返回顶部
 * @require '../_.js'
 */
(function(window) {
    //查看位置
    var getScrollTop = function() {
        var top = window.scrollY;
        if (top > 100) {
            this.isShow = 1;
        } else {
            this.isShow = 0;
        }
    };


    window.RUI.scrollTop = {
        template: __inline('scroll-top.tpl'),
        ready: function() {
            var that = this;
            this._onscroll = function() {
                getScrollTop.call(that);
            };
            window.addEventListener('scroll', this._onscroll);
            this._onscroll(); //初始化
        },
        destroyed: function() {
            window.removeEventListener('scroll', this._onscroll);
        },
        data: function() {
            return {
                isShow: 0
            };
        },
        methods: {
            toTop: function() {
                window.scroll(0, 0);
                this.isShow = 0;
            }
        }
    };
}(this));
