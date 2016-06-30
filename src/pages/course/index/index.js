/*
 * 课程详情
 * @require /libs/vue.js
 * @require /components/components.js
 * @require /utils/utils.js
 * @require details/details.js
 * @require enroll/enroll.js
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var modal = UI.modal;
    var APP = window.RAPP;

    //状态
    var status = {
        id: utils.urlParse().search['id'], //课程id
        step: 1, //当前步骤
        isInit: true, //正在初始化
        orderId: null, //订单id
        info: null //课程详情
    };

    //同步函数
    var mutations = {
        setStep: function(step) {
            status.step = step;
        },
        afterUpdate: function() {
            status.isInit = false;
        },
        beforeUpdate: function() {
            status.isInit = true;
        },
        onUpdate: function(data) {
            //地图链接
            data.mapUrl = __uri('/pages/map/map.html') +
                '?lon=' + (data.lon || '') +
                "&lat=" + (data.lat || '') +
                "&address=" + (data.address || '');
            //机构详情页面
            data.groupUrl = __uri('/pages/group/index/index.html') + '?id=' + data.group.id;
            //teacher详情页面
            data.teacherUrl = __uri('/pages/group/teacher/teacher.html');

            //课程介绍
            data.remark && (data.remark = data.remark.replace(/[\n\r\t\f\b]/g, '1'));

            //服务说明
            data.tos && (data.tos = data.tos.replace(/[\n\r\t\f\b]/g, '2'));

            status.info = data;
        },
        onError: function(msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        },
        oncreated: function(orderId) {
            status.orderId = orderId;
            status.step = 2;
        }
    };

    //包含异步操作的函数
    var actions = {
        oncreated: mutations.oncreated,
        onenroll: function() {
            location.href = __uri('/pages/pay/index/index.html') + '?id=' + this.orderId;
        },
        getDefaultGroupImg: function() {
            this.info.group.logo = __uri('/components/default/jigou_logo@2x.png');
        }
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'app-details': APP.courseDetails,
            'app-enroll': APP.courseEnroll,
            'ui-loading': UI.loading,
        },
        methods: actions,
        events: {
            onalert: mutations.onError
        }
    });

    //初始化
    xhr({
        url: "{student}/course/detail",
        data: {
            id: status.id
        },
        success: function(data) {
            mutations.afterUpdate();
            mutations.onUpdate(data);
        },
        error: function(data, msg) {
            mutations.afterUpdate();
            mutations.onError(msg || '网络异常');
        }
    });

}(window));
