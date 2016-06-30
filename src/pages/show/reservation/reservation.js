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
    var sendMessage2RUNEDU = window.sendMessage2RUNEDU;
    //状态
    var status = {
        title: "预约拍摄",
        isLoading: false,
        dialog: null,
        banner: [
            {url:"",
            imgUrl: __uri("images/1.png")},
            {url:"",
            imgUrl: __uri("images/2.png")},
            {url:"",
            imgUrl: __uri("images/3.png")},
            {url:"",
            imgUrl: __uri("images/4.png")},
            {url:"",
            imgUrl: __uri("images/5.png")}
        ],
        works:[
            {
                coverImg:__uri("images/gedou.jpg"),
                url:"https://o4jeap1oz.qnssl.com/5337364644673216512_360p_v1.m3u8"
            },
            {
                coverImg:__uri("images/daizu.jpg"),
                url:"https://o4jeap1oz.qnssl.com/5335468070514843648_360p_v1.m3u8"
            }
        ]
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
        },
        onError: function(msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        }
    };

    //包含异步操作的函数
    var actions = {
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
            showMovie: function(work){
                sendMessage2RUNEDU.switchApp(5,{
                    url: work.url,
                });
            }
        }
    });
}(window));
