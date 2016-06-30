/*
 * 投诉
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

    var id = utils.urlParse().search['id'];
    
    //状态
    var status = {
        info: {
            mobile: "",
            bgcovor:"covor",
        }
    };


    var mutations = {
        onUpdata: function(data){
            if(!data.logo){
                data.logo = __uri('/components/default/vip.png');
            }

            if(!data.background){
                data.background = __uri('/components/default/vip-bg.png');
            }

            status.info = data;
        }
    };

    //包含异步操作的函数
    var actions = {
        
        load: function(){
            xhr({
                url: "{student}/vip/info",
                data: {
                    id : id,
                },
                success: function(data){
                    mutations.onUpdata(data);
                },
                error: function(r, msg) {
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },


    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-dialog': UI.dialog
        },
        methods: {
            clickload: utils.downloadAppRedirect
        }
    });

    //初始化
    actions.load();

}(window));
