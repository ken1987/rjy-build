/*
 * 机构列表
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var geolocation = utils.geolocation;
    var modal = UI.modal;

    //链接地址
    var courseListUrl = __uri('/pages/course/list/list.html'); //全部课程
    var courseAllUrl = __uri('/pages/course/subject/subject.html'); // 全部课程
    var groupUrl = __uri('/pages/group/index/index.html'); //机构主页
    var courseUrl = __uri('/course/index.html'); //课程详情页
    var imgUrl = __uri('/components/icons/images/quanbu.png'); //全部课程图片
    var recommendImg = __uri('/components/default/vip.png');

    //数据状态
    var status = {
        banner: [],
        activity: [],
        categorys: [],
        headline: [],
        near: [],
        groups: [],
        courses: [],
        lon: null,
        lat: null,
    };

    //同步修改状态
    var mutations = {
        format: function(key, data, urlBase) {
            if (data && data.length) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var n = data[i];
                    n.url = urlBase + n.groupId;
                    if(!n.imgUrl){
                        n.imgUrl = recommendImg;
                    }
                }
                status[key] = data;
            }
        },

        coursesFormat: function(key, data, urlBase) {
            if (data && data.length) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var n = data[i];
                    n.url = urlBase + n.courseId;
                    if(!n.imgUrl){
                        n.imgUrl = recommendImg;
                    }
                }
                status[key] = data;
            }
        },

        hotListFormat: function(key, data, urlBase) {
            if (data && data.length) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var n = data[i];
                    n.url = urlBase + n.subjectId + "&subjectName=" + n.title;
                }
                status[key] = data;
            }
        },

        setNear: function(data) {
            var urlBase = groupUrl + '?id=';
            if (data && data.length) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var n = data[i];
                    n.url = urlBase + n.groupId;
                }
                status.near = data;
            }
        },
        typeFormat: function(key,data){
            for (var i = 0, l = data.length; i < l; ++i) {
                if(data[i].jumpType === 1){         //首页
                    data[i].url = data[i].url;  
                }else if(data[i].jumpType === 2){   //机构详情
                    data[i].url = '/group/index.html?id='+ data[i].url;
                }else if(data[i].jumpType === 3){   //课程详情
                    data[i].url = '/course/index.html?id='+ data[i].url;
                }else if(data[i].jumpType === 4){   //活动详情
                    data[i].url = '/activity/details.html?id='+ data[i].url;
                }else if(data[i].jumpType === 5){   //润秀场详情
                    data[i].url = '/show/detail.html?id='+ data[i].url;
                }else if(data[i].jumpType === 6){   //vip详情
                    data[i].url = '/vip/share.html?id='+ data[i].url;
                }else if(data[i].jumpType === 20){   //机构列表页
                    data[i].url = '/group/list.html';
                }else if(data[i].jumpType === 21){   //活动列表页
                    data[i].url = '/activity/index.html';
                }else if(data[i].jumpType === 22 || data[i].jumpType === 23){   //vip详情
                    data[i].url = '/download.html';
                }else if(data[i].jumpType === 0){
                    data[i].url = ""; 
                }else{
                    data[i].url = data[i].url; 
                }    
            }
            status[key] = data;
        },
    };

    var actions = {
        //基础数据
        loadBase: function() {
            xhr({
                url: "{student}/content/index",
                data: {
                    version: 30
                },
                success: function(data) {
                    //banner 推荐
                    mutations.typeFormat('banner',data.rotates);
                    
                    //热门科目
                    data.subjects = data.subjects || [];

                    mutations.hotListFormat(
                        'categorys',
                        data.subjects,
                        courseListUrl + '?subjectId='
                    );
                    //热门课程中的全部课程
                    data.subjects.push({
                        title: '全部',
                        imgUrl: imgUrl,
                        url: courseAllUrl
                    });
 
                    //推荐机构
                    mutations.format('groups', data.groups, groupUrl + '?id=');
                    //推荐课程
                    mutations.coursesFormat('courses', data.courses, courseUrl + '?id=');
                    
                    //推荐活动
                    mutations.typeFormat('activity', data.specials);
                    //润头条
                    mutations.typeFormat('headline', data.headlines);
                },
                error: function(r, msg) {
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },
        //最近的机构推荐
        getNear: function() {
            xhr({
                url: "{student}/group/near",
                data: {
                    lon: status.lon,
                    lat: status.lat
                },
                success: mutations.setNear,
                error: function(r, msg) {
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },

    };

    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-banner': UI.banner,
            'ui-banner-download': UI.bannerDownload,
            'ui-scroll-top': UI.scrollTop,
            'ui-swiper-headline': UI.swiperHeadline 
        }
    });

    //初始化
    actions.loadBase();

    geolocation(function(lon, lat) {
        status.lon = lon;
        status.lat = lat;
        actions.getNear();
    }, function(msg) {
        console.error(msg);
        actions.getNear();
    });

}(window));
