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
    var xhr = utils.xhr;
    var modal = UI.modal;
    var videojs = window.videojs;

    //video
    // Vue.directive('video', {
    //     bind: function() {
    //         var video = videojs(this.el, {
    //             autoplay: false,
    //             controls: true,
    //             techOrder: ['html5']
    //         });

    //         /**
    //          * 修复安卓机在微信或者QQ客户端的webview中播放视频时跳过片头的bug
    //          * 场景：第一次加载视频时，没有缓存。第二次有缓存后，不会出现。
    //          * 方案：监听progress，每次有新的缓冲加载时，都会被吊起。
    //          * bug出现规律：时间瞬间从0到8秒（片头长度）
    //          */
    //         // var that = this;
    //         // var i = 0;

    //         var videoFixBugFn = function() {
    //             // that.vm.tts.push(++i + 'progress' + video.currentTime() + '--b=' + video.bufferedEnd() + '--bp=' + video.bufferedPercent());
    //             var time = video.currentTime();
    //             if (time > 0) {
    //                 if (time > 1.5) {
    //                     video.currentTime(0); //重置缓存时间
    //                     // that.vm.tts.push(++i + '重置缓存时间');
    //                 }
    //                 // that.vm.tts.push(++i + 'unbind');
    //                 video.off('progress', videoFixBugFn);
    //             }
    //         };
    //         video.on('progress', videoFixBugFn);

    //         this.video = video;
    //         this.videoFixBugFn = videoFixBugFn;
    //     },

    //     update: function(newValue, oldValue) {
    //         this.video.src(newValue);
    //         this.video.poster(this.vm.info.thumbnailUri);
    //     },

    //     unbind: function() {
    //         this.video = null;
    //         this.videoFixBugFn = null;
    //     }
    // });

    //状态
    var status = {
        // tts:[],
        title: "节目详情",
        isLoading: false,
        id: utils.urlParse().search['id'],
        info: null,
        dialog: null
    };

    //同步函数
    var mutations = {
        afterUpdate: function() {
            status.isLoading = false;
        },
        beforeUpdate: function() {
            status.isLoading = true;
        },
        onUpdate: function(data) {
            //修改当前页面title 的内容
            var title = data.title;
            status.title = title;
            document.title = title;

            //机构链接
            data.groupUrl = __uri('/pages/group/index/index.html') +
                '?id=' + (data.group && data.group.id || '');

            //格式化简介
            data.intro && (data.intro = data.intro.replace(/[\n\r]/g, '<br>'));

            status.info = data;
        },
        onError: function(msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (status.isLoading) return;
            mutations.beforeUpdate();
            xhr({
                url: "{student}/show/info",
                data: {
                    showId: status.id //104
                },
                success: function(data) {
                    mutations.onUpdate(data);
                    mutations.afterUpdate();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
                    mutations.onError("该节目不存在");
                }
            });
        }
    };

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

    //加载
    actions.load();
}(window));
