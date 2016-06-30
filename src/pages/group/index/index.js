/*
 * 机构主页
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var modal = UI.modal;
    var xhr = utils.xhr;
    var id = utils.urlParse().search['id'];

    //状态
    var status = {
        id: id,
        isInit: false,
        info: null,
        aboutUrl: __uri('../about/about.html') + '?groupId=' + id, //机构简介
        courseListUrl: __uri('../course/course.html') + '?groupId=' + id, //机构课程列表
        commentUrl: __uri('../comment/comment.html') + '?groupId=' + id, //机构评论
        activityListUrl: __uri('../activity/activity.html') + '?groupId=' + id, //机构活动列表
        wallUrl: __uri('../honors/honors.html') + '?groupId=' + id, //机构荣誉
        teacherUrl: __uri('../teachers/teachers.html') + '?groupId=' + id, //机构老师列表

        activityUrl: __uri('/pages/activity/details/details.html'), //活动详情
        courseUrl: __uri('/pages/course/index/index.html'), //课程详情

        mapUrl: '',
        hiddenLoading:true,
    };

    //同步函数
    var mutations = {
        afterUpdate: function() {
            status.isInit = false;
            status.hiddenLoading = false;
        },
        onUpdate: function(data) {
            //地图链接
            status.mapUrl = __uri('/pages/map/map.html') +
                '?lon=' + (data.lon || '') +
                "&lat=" + (data.lat || '') +
                "&address=" + (data.address || data.addressDetail || '') +
                "&name=" + (data.groupName || '');

            status.info = data;

        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        computed: {
            template: function() {
                var template = this.info && this.info.template;
                if (template) {
                    return "style" + template.theme + " layout" + template.style;
                }
                return '';
            }
        },
        components: {
            'ui-header': UI.header,
            // 'ui-header-collect': UI.headerCollect,
            'ui-header-back': UI.headerBack,
            'ui-loading': UI.loading
        },
        events: {
            alert: function(title, content, style) {
                modal.alert({
                    title: title,
                    content: content,
                    style: style
                });
            }
        },
        methods: {
            getDefaultImg: function() {
                this.info.logo = __uri('/components/default/jigou_logo@2x.png'); 
            }
        }
    });

    //初始化
    xhr({
        url: "{student}/group/home",
        data: {
            groupId: id
        },
        success: function(data) {
            mutations.onUpdate(data);
            mutations.afterUpdate();
        },
        error: function(r, msg) {
            mutations.afterUpdate();
            modal.alert({
                title: msg || '网络异常'
            });
        }
    });
}(window));
