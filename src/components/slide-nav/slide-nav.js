/**
 * 滑动导航
 * @require '../_.js'
 */
window.RUI.slideNav = {
    template: __inline('slide-nav.tpl'),
    props: {
        category: {
            type: Array,
            default: function() {
                return [];
            }
        },
        cur: {
            default: 0
        }
    },
    data: function() {
        return {
            distance: 0, //移动距离
            maxPanDistance: 0 //最大移动距离
        };
    },
    
    computed: {
        //样式
        style: function() {
            return {
                "transform": "translate(" + (-this.distance) + "px, 0) translateZ(0)"
            };
        }
    },
    methods: {
        //移动事件
        onPan: function(distance) {
            this.distance -= distance;

            if (this.distance < 0) {
                this.distance = 0;
            }

            if (this.distance > this.maxPanDistance) {
                this.distance = this.maxPanDistance;
            }
        },
        change: function(index) {
            this.cur = index;
            this.$dispatch('change', index, this.category[index]);
        }
    },
    ready: function() {
        //绑定事件
        var dom = this.$els.content;
        var callback = this.onPan;

        var startX, endX, curX, oldX;

        var _start = function(e) {
            var t = e.changedTouches[0]; // 获取当前 事件的
            startX = curX = t.clientX; //开始的坐标和 当前的坐标相等
            this.addEventListener('touchmove', _move, false);
            this.addEventListener('touchend', _end, false);
        };

        var _move = function(e) {
            var t = e.changedTouches[0];
            endX = t.clientX; // 此时为结束的坐标
            oldX = parseInt(this.style.left);
            //兼容 安卓手机 QQ 浏览器滑动不顺滑的bug
            e.preventDefault();
            console.log(oldX);
            callback(endX - curX, curX - startX, oldX);
            curX = endX; //此时当前的 坐标等于 结束时候的坐标
        };

        var _end = function(e) {
            this.removeEventListener('touchmove', _move);
            this.removeEventListener('touchend', _end);
        };

        dom.addEventListener('touchstart', _start, false);

        //监听数据
        this.$watch('category', function() {
            var maxPanDistance = this.$els.content.clientWidth - this.$el.clientWidth;
            this.maxPanDistance = maxPanDistance > 0 ? maxPanDistance : 0;
        });
    }
};
