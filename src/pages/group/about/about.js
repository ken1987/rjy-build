/*
 * 机构简介
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;

    //状态
    var status = {
        title: "机构简介",
        isLoading: false,
        id: utils.urlParse().search['groupId'],
        info: {
            mapUrl: '', //地图链接
            groupName: "",
            logo: "",
            groupScore: "",
            tag: "",
            telephone: "",
            address: "",
            addressDetail: "",
            lon: '',
            lat: '',
            template: {},
            recCourses: [],
            recActivities: [],
            introduction: "",
            pics: []
        }
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
            //图片格式
            var n, picss = [];
            for (var i = 0, l = data.pics.length; i < l; i++) {
                n = data.pics[i];
                picss.push({
                    imgUrl: n.uri
                });
            }

            status.title = data.groupName;
            data.pics = picss;

            //地图链接
            data.mapUrl = __uri('/pages/map/map.html') +
                '?lon=' + (data.lon || '') +
                "&lat=" + (data.lat || '') +
                "&address=" + (data.address || data.addressDetail || '') +
                "&name=" + (data.groupName || '');

            //机构简介
            if(data.introduction){
                data.introduction=data.introduction.replace(/[\n\r]/g, '<br>');
            }

            status.info = data;
            console.log(status.info);
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (status.isLoading) return;

            mutations.beforeUpdate();

            xhr({
                url: "{student}/group/home",
                data: {
                    groupId: status.id
                },
                success: function(data) {
                    mutations.onUpdate(data);
                    mutations.afterUpdate();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
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
            'ui-banner': UI.banner
        },
        methods: {

        }
    });

    //初始化
    actions.load();
}(window));
